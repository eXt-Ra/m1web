import React, { PropTypes } from 'react'
import './ListHousing.scss';

class ListHousing extends React.Component {
  render () {
    return(
      <div className="col-2 list-container">
        <h3>{this.props.region}</h3>
        <div className="filterinput-wrapper">
          <input type="text" placeholder="Filtrer par code postal" className="filterinput form-control" onChange={(e)=> this.props.handleFilterChange(e)}/>
        </div>
        <div className="list-wrapper">
          {this.props.housing.map((housing, index) => <div key={index} className="list-item" onClick={(e)=>this.props.handleItemListClick(e,housing)}>
            <div className="image-wrapper">
              <img src={`/uploads/${housing.image_region}`}/>
            </div>
            <div className="content-wrapper">
              <p>{housing.adresse}</p>
              <p>{housing.cp}</p>
            </div>
            <div className="desc-wrapper">
              <p>{housing.desc}</p>
            </div>
          </div>)}
        </div>
      </div>
    )
  }
}

export default ListHousing;
