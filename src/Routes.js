import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Teachable from 'views/teachable';
import TeachableMain from 'views/teachableMain';


export default function Routes(props) {

    return (
        <>
            <Switch>
                <Route path="/" exact component={(props) => <TeachableMain {...props} />} />
                <Route path="/teachable/:type" exact component={(props) => <Teachable {...props} />} />
            </Switch>
        </>
    )
}

