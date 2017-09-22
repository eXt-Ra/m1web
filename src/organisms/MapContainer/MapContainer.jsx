import React, { PropTypes } from 'react';
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import { compose, withProps, withState, withHandlers, lifecycle } from "recompose";
import './MapContainer.scss';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";


const MapWithControlledZoom = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD3hjeBO8AxlWV1LHjzfCKXFo6m0UzSL-4&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div className="map-loading" />,
    containerElement: <div className="map-container col-10" />,
    mapElement: <div className="map-wrapper" />
  }),
  withState('zoom', 'onZoomChange', 8),
  withHandlers(() => {
    const refs = {
      map: undefined,
    }
    return {
      onMapMounted: (o) => ref => {
        refs.map = ref
        let bounds = new google.maps.LatLngBounds;
        o.housing.map((house, index) => {
          bounds.extend(house.coord)
        });
        o.setStateCenter(bounds.getCenter())
        console.log(o.housing);
      },
      onZoomChanged: ({ onZoomChange }) => () => {
        onZoomChange(refs.map.getZoom())
      }
    }
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    center={props.center}
    zoom={props.zoom}
    ref={props.onMapMounted}
    onZoomChanged={props.onZoomChanged}>
    {props.housing.map((housing, index) =>
      <Marker
        key={index}
        position={housing.coord}
        onClick={()=> props.onToggleOpen(housing)}
        icon={{
					url: require(`./../../images/pin.svg`)
				}}>
        {housing.isOpen && <InfoBox
          defaultPosition={new google.maps.LatLng(housing.coord.lat, housing.coord.lng)}
          visible= {true}
          options={{
            boxClass: "infobox alert alert-warning",
            alignBottom: true,
            disableAutoPan: false,
            pixelOffset: new google.maps.Size(-85, -13),
            closeBoxMargin: "10px 10px 0px 0px",
            closeBoxURL: require(`./../../images/cancel.svg`),
            infoBoxClearance: new google.maps.Size(1, 1),
            enableEventPropagation: true
          }}
          onCloseClick={()=> props.onToggleOpen(housing)}>
          <div style={{padding: `12px` }}>
            <div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
              <p>{housing.adresse}</p>
              <p>{housing.cp}</p>
            </div>
          </div>
        </InfoBox>}
      </Marker>)}
  </GoogleMap>
);

class MapContainer extends React.Component {
  render () {
    return(
      <MapWithControlledZoom
        housing={this.props.housing}
        setStateCenter={this.props.setStateCenter}
        center={this.props.center}
        onToggleOpen={this.props.onToggleOpen}/>
    )
  }
}

export default MapContainer;
