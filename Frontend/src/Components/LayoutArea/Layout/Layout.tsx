
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Unsubscribe } from "redux";
import store from "../../../Redux/Store";
import Header from "../Header/Header";
import Routing from "../Routing/Routing";
import "./Layout.css";

function Layout(): JSX.Element {
    const [user, setUser] = useState({});
    let unsubscribe: Unsubscribe;

    useEffect(() => {
        unsubscribe = store.subscribe(() => setUser(store.getState().authState.user));
        return () => unsubscribe();
    }, [user]);
    
    return (
        <BrowserRouter>
                <div className="Layout">
                    {store.getState().authState.user && <header><Header /></header>}
                    <main><Routing /></main>
                </div>
        </BrowserRouter>
    );
}

export default Layout;
