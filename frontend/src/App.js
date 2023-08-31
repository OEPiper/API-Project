import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsIndex from "./components/SpotsIndex";
import SpotShow from "./components/SpotShow";
import CreateSpotForm from "./components/CreateSpotForm";
import ManageSpots from "./components/ManageSpots";
import UpdateSpotForm from "./components/UpdateSpotForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
          <Route exact path='/' component={SpotsIndex}/>
          <Route exact path='/spots/new' component={CreateSpotForm}/>
          <Route exact path='/spots/current' component={ManageSpots}/>
          <Route exact path='/spots/:spotId/edit' component={UpdateSpotForm}/>
          <Route exact path='/spots/:spotId' component={SpotShow}/>
        </Switch>}
    </>
  );
}

export default App;