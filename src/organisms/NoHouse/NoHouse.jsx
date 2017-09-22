import React, { PropTypes } from 'react'
import './NoHouse.scss';
import {Link} from 'react-router-dom';

class NoHouse extends React.Component {
  render () {
    return(<div className="landing-page sidebar-collapse">
        <div className="wrapper">
            <div className="page-header page-header-small">
                <div className="page-header-image" data-parallax="true">
                </div>
                <div className="container">
                    <div className="content-center">
                        <h1 className="title">Cette région ne comporte pas d'appartement à louer !</h1>
                    </div>
                </div>
            </div>
            <div className="section section-about-us" id="titre2">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 ml-auto mr-auto text-center">
                            <h2 className="title">Vous pouvez retourner à l'accueil ou ajouter un appartement</h2>
                            <Link to="/"><button className="btn btn-primary">Accueil</button></Link>
                            <Link to="/addhouse"><button className="btn btn-primary">Ajouter</button></Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>)
  }
}

export default NoHouse;
