import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Teachable from 'views/teachable';
import Annotation from 'views/annotation';
import TeachableMain from 'views/teachableMain';


export default function Routes(props) {

    return (
        <>
            <Switch>
                <Route path="/" exact component={(props) => <TeachableMain {...props} />} />
                <Route path="/easyml/:type/:subType/" exact component={(props) => <Teachable {...props} />} />
                <Route path="/easyml/:type/:subType/:annotation" exact component={(props) => <Teachable {...props} />} />
                <Route path="/annotation" exact component={(props) => <Annotation {...props} />} />
            </Switch>
        </>
    )
}

