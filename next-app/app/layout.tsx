import { PropsWithChildren } from "react";
import "normalize.css";
import "../styles/globals.scss";
import "@epam/uui-components/styles.css";
import "@epam/promo/styles.css";
import "@epam/uui/styles.css";
import "@epam/uui-editor/styles.css";
import { AppView } from "./AppView";

function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <title>Create Next App</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className="uui-theme-promo">
                <div className="container">
                    <AppView>{children}</AppView>
                </div>
            </body>
        </html>
    );
}

export default RootLayout;
