import { Node, Symbol, SyntaxKind, Type } from 'ts-morph';
import { IConverterContext } from '../types/types';
import { SymbolUtils } from './converterUtils/symbolUtils';
import { NodeUtils } from './converterUtils/nodeUtils';
import { TypeUtils } from './converterUtils/typeUtils';
import { TTypeProp } from '../types/docsGenSharedTypes';

export function extractProps(parentNode: Node, context: IConverterContext): {
    props: TTypeProp[],
    fromUnion: boolean
} | undefined {
    const type = NodeUtils.getTypeFromNode(parentNode);
    const idGen = new SimpleIdGen();
    if (type.isUnion()) {
        const unionTypes = type.getUnionTypes();
        const props = extractPropsFromNonUnionTypeArr(unionTypes, parentNode, context, idGen);
        return {
            props,
            fromUnion: true,
        };
    } else {
        const props = extractPropsFromNonUnionType({ parentNode, type, context, idGen });
        if (props) {
            return {
                props,
                fromUnion: false,
            };
        }
    }
}

function extractPropsFromNonUnionTypeArr(typeArr: Type[], parentNode: Node, context: IConverterContext, idGen: SimpleIdGen) {
    const allSupportProps = typeArr.every((singleType) => {
        const typeNode = TypeUtils.getNodeFromType(singleType);
        /*
         * If node isn't available for this type, then we treat it as internal.
         * I hope it's OK - in the worst case, the end user will see a bunch of props from the external type.
         */
        const isExternalType = typeNode ? NodeUtils.isExternalNode(typeNode) : false;
        return TypeUtils.isPropsSupportedByType({ type: singleType, isExternalType });
    });
    if (allSupportProps) {
        const allPropsSets = typeArr.reduce<PropsSet[]>((acc, singleType) => {
            const utProps = extractPropsFromNonUnionType({ parentNode, type: singleType, context, idGen });
            if (utProps) {
                acc.push(PropsSet.fromArray(utProps));
            }
            return acc;
        }, []);
        return PropsSet.concat(allPropsSets);
    }
}

function extractPropsFromNonUnionType(params: { parentNode: Node, type: Type, context: IConverterContext, idGen: SimpleIdGen }): TTypeProp[] | undefined {
    const { parentNode, type, context, idGen } = params;
    /*    if (type.isIntersection()) {
        const typeArr = type.getIntersectionTypes();
        return extractPropsFromNonUnionTypeArr(typeArr, parentNode, context, idGen);
    } */
    const propsOnly = type.getProperties();
    const indexSigns = TypeUtils.getIndexSignature(type);
    const props = indexSigns.concat(propsOnly);
    if (props.length > 0) {
        return props.reduce<TTypeProp[]>((acc, propertySymbol) => {
            const mapped = mapSingleMember({ parentNode, propertySymbol, context, idGen });
            if (mapped) {
                acc.push(mapped);
            }
            return acc;
        }, []);
    }
}

function mapSingleMember(params: { parentNode?: Node, propertySymbol: Symbol, context: IConverterContext, idGen: SimpleIdGen }): TTypeProp | undefined {
    const { parentNode, propertySymbol, context, idGen } = params;
    let prop: TTypeProp | undefined = undefined;
    const propertyNode = SymbolUtils.getNodeFromSymbol(propertySymbol);
    const nKind = propertyNode.getKind();
    const isSupported = [
        SyntaxKind.PropertySignature,
        SyntaxKind.MethodSignature,
        SyntaxKind.GetAccessor,
        SyntaxKind.SetAccessor,
        SyntaxKind.MethodDeclaration,
        SyntaxKind.PropertyDeclaration,
        SyntaxKind.IndexSignature,
    ].indexOf(nKind) !== -1;

    if (isSupported) {
        const raw = NodeUtils.getPropertySymbolRawType(propertySymbol, context);
        if (!raw) {
            return;
        }
        const comment = NodeUtils.getCommentFromNode(propertyNode);
        const from = NodeUtils.getTypeParentRef(propertyNode, parentNode);
        const fromShort = from ? context.refs.set(from) : undefined;
        const name = NodeUtils.getPropertyNodeName(propertyNode);
        const required = NodeUtils.isPropertyNodeRequired(propertyNode);
        const uid = idGen.getNextId();
        prop = {
            uid,
            name,
            comment,
            typeValue: { raw },
            from: fromShort,
            required,
        };
    } else {
        console.error(`New SyntaxKind was found: ${nKind}. Please add it to the list and check that it's processed correctly.`);
    }
    return prop;
}

class PropsSet {
    private _propsMap = new Map<string, TTypeProp>();

    add(p: TTypeProp) {
        const id = PropsSet.buildId(p);
        this._propsMap.set(id, p);
    }

    addAll(pa: TTypeProp[]) {
        pa.forEach((p) => {
            const id = PropsSet.buildId(p);
            this._propsMap.set(id, p);
        });
    }

    has(p: TTypeProp): boolean {
        const id = PropsSet.buildId(p);
        return this._propsMap.has(id);
    }

    toArray(): TTypeProp[] {
        return [...this._propsMap.values()];
    }

    static concat(psa: PropsSet[]): TTypeProp[] {
        const tempPs = psa.reduce<PropsSet>((acc, ps) => {
            acc.addAll(ps.toArray());
            return acc;
        }, new PropsSet());
        return tempPs.toArray();
    }

    static fromArray(pa: TTypeProp[]): PropsSet {
        const ps = new PropsSet();
        pa.forEach((p) => {
            ps.add(p);
        });
        return ps;
    }

    static buildId(p: TTypeProp) {
        // we don't use uniqueId property because we need to eliminate duplicates which come from same type (it's possible in union types)
        return `${p.from}:${p.name}:${p.typeValue.raw.replace(/[\n\s]/g, '')}`;
    }
}

class SimpleIdGen {
    private _id = 0;

    getNextId = () => {
        return ++this._id;
    };
}
