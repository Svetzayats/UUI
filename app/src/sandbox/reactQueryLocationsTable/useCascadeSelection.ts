import { CascadeSelection, DataRowOptions, DataSourceState, IMap, ITree, LazyDataSourceApi, TreeLoadResult,
    TreeParams, useCascadeSelectionService, Tree as UUITree } from '@epam/uui-core';
import { useQueryClient } from '@tanstack/react-query';
import { Location } from '@epam/uui-docs';
import { Tree } from './Tree';
import { useCallback, useMemo } from 'react';

export interface UseCascadeSelectionProps<TItem, TId> extends TreeParams<Location, string> {
    api: LazyDataSourceApi<Location, string, unknown>,
    cascadeSelection?: CascadeSelection;
    getRowOptions?: (item: TItem, index?: number) => DataRowOptions<TItem, TId>;
    rowOptions?: DataRowOptions<TItem, TId>;
    dataSourceState: DataSourceState<any, string>;
    isFolded: (item: Location) => boolean;
    itemsMap?: IMap<TId, Location>;
}
type LocationsSelectionKey = [string, DataSourceState<Record<string, any>, any>, (item: Location) => boolean, CascadeSelection];

const LOCATIONS_SELECTION_QUERY = 'locations-selection';

const isTree = <TItem, TId>(tree: ITree<TItem, TId> | TreeLoadResult<TItem, TId>): tree is ITree<TItem, TId> => {
    return tree instanceof Tree;
};

export function useCascadeSelection({
    api,
    getId,
    getParentId,
    complexIds,
    cascadeSelection = false,
    getRowOptions,
    rowOptions,
    dataSourceState,
    isFolded,
    itemsMap,
}: UseCascadeSelectionProps<Location, string>) {
    const queryClient = useQueryClient();
    const blankTree = useMemo(() => Tree.blank({ getId, getParentId, complexIds }, itemsMap), []);

    const loadMissingRecordsOnCheck = useCallback(async (id: string, isChecked: boolean, isRoot: boolean) => {
        queryClient.invalidateQueries({ queryKey: [LOCATIONS_SELECTION_QUERY] });

        return await queryClient.fetchQuery<Tree, Error, Tree, LocationsSelectionKey>({
            queryKey: [LOCATIONS_SELECTION_QUERY, dataSourceState, isFolded, cascadeSelection],
            queryFn: async ({ queryKey: [, _dataSourceState, _isFolded, _cascadeSelection] }) => {
                const prevTree = queryClient.getQueryData<Tree>([LOCATIONS_SELECTION_QUERY]) ?? blankTree;

                const result = await UUITree.loadMissingOnCheck<Location, string, unknown>({
                    checkedId: id,
                    isChecked,
                    isRoot,
                    tree: prevTree,
                    api,
                    getChildCount: (l) => l.childCount,
                    cascadeSelection: _cascadeSelection,
                    isFolded: _isFolded,
                    dataSourceState: _dataSourceState,
                });

                if (isTree(result)) {
                    return result as Tree;
                }

                const { loadedItems, byParentId, nodeInfoById } = result;
                const newTree = prevTree.update(loadedItems, byParentId, nodeInfoById);
                queryClient.setQueryData([LOCATIONS_SELECTION_QUERY], newTree);

                return newTree;
            },
            initialData: () => queryClient.getQueryData([LOCATIONS_SELECTION_QUERY]),
        });
    }, [api, blankTree, cascadeSelection, dataSourceState, isFolded, queryClient]);

    const cascadeSelectionService = useCascadeSelectionService({
        tree: blankTree,
        cascadeSelection,
        getRowOptions,
        rowOptions,
        loadMissingRecordsOnCheck,
    });

    return cascadeSelectionService;
}
