import React, { PropTypes } from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios';

class AddHouse extends React.Component {
  constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
    this.state ={
			adresse_logement: "",
			adresse_logement_Valid: false,
      cp_logement: "",
      cp_logement_Valid: false,
      nom_region: "",
      nom_region_Valid: false,
      description_logement: "",
      description_logement_Valid: false,
      image_name:"",
      image_name_Valid:false,
      image_file: "",
      image_file_Valid: false,
			formValid: false
		};
	}
  componentDidMount() {
    document.querySelector('.navbar-expand-lg').setAttribute('color-on-scroll', '100');
    document.querySelector('.page-header').setAttribute('filter-color', 'orange');
  }
  handleSubmit(event) {
		event.preventDefault();
		this.getGeocode(this.state.adresse_logement).then((geocode)=>{
			console.log(this.state.image_name.size);
			axios.post(`http://localhost:8888/api.php`,{
		    adresse_logement: this.state.adresse_logement,
		    cp_logement: this.state.cp_logement,
		    nom_region: this.state.nom_region,
		    description_logement: this.state.description_logement,
		    image_name: this.state.image_name.name,
		    image_size: this.state.image_name.size,
		    image_file: this.state.image_file,
				fnc: "AddLogement",
				coords_logement: geocode
		  }).then(res => {
					console.log(res.data);
					this.props.history.push(`/map/${this.state.nom_region}`);
			});
		})
	}
	getGeocode(adresse){
		console.log(adresse.split(' ').join('+'));
		return new Promise(function(resolve, reject) {
			axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${adresse}&key=AIzaSyD3hjeBO8AxlWV1LHjzfCKXFo6m0UzSL-4`).then(res => {
				console.log(res.data);
					console.log(res.data.results[0].geometry.location);
					resolve(res.data.results[0].geometry.location);
			});
		});
	}
  handleInputChange(e) {
		const name = e.target.name;
		const value = e.target.value;
    if (name == "image") {
      let reader = new FileReader();
      let file = e.target.files[0];

      reader.onloadend = () => {
        this.setState({
          image_name: file,
          image_file: reader.result
        }, () => {
					this.validateField(name, value)
				});
      }

      reader.readAsDataURL(file)
    }
		this.setState({
			[name]: value
		}, () => {
			this.validateField(name, value)
		});
	}
  validateField(fieldName, value) {
		let adresse_logement_Valid = this.state.adresse_logement_Valid;
		let cp_logement_Valid = this.state.cp_logement_Valid;
		let nom_region_Valid = this.state.nom_region_Valid;
		let description_logement_Valid = this.state.description_logement_Valid;
		let image_name_Valid = this.state.image_name_Valid;
		switch (fieldName) {
			case 'adresse_logement':
				adresse_logement_Valid = value.length >= 1;
				break;
			case 'cp_logement':
				cp_logement_Valid = value.length >= 1;
				break;
			case 'nom_region':
				nom_region_Valid = value.length >= 1;
				break;
			case 'description_logement':
				description_logement_Valid = value.length >= 1;
				break;
			case 'image':
				image_name_Valid = value.length >= 1;
				break;
		}
		this.setState({
			adresse_logement_Valid: adresse_logement_Valid,
			cp_logement_Valid: cp_logement_Valid,
			nom_region_Valid:nom_region_Valid,
			description_logement_Valid:description_logement_Valid,
			image_name_Valid:image_name_Valid
		}, this.validateForm);
	}
	validateForm() {
		this.setState({
			formValid: this.state.adresse_logement_Valid && this.state.cp_logement_Valid && this.state.nom_region_Valid && this.state.description_logement_Valid && this.state.image_name_Valid
		});
	}
  render () {
    return(
      <div className="login-page sidebar-collapse">
          <nav className="navbar navbar-expand-lg bg-primary fixed-top navbar-transparent">
              <div className="container">
                  <div className="navbar-translate">
                      <button className="navbar-toggler navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                          <span className="navbar-toggler-bar bar1"></span>
                          <span className="navbar-toggler-bar bar2"></span>
                          <span className="navbar-toggler-bar bar3"></span>
                      </button>
                  </div>
                  <div className="collapse navbar-collapse justify-content-end" id="navigation" data-nav-image="assets/img/blurred-image-1.jpg">
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <Link className="nav-link" to="/">Nos logements</Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="/addhouse">Ajouter un logement</Link>
                        </li>
                      </ul>
                  </div>
              </div>
          </nav>
          <div className="page-header">
              <div className="page-header-image"></div>
              <div className="container">
                  <div className="col-md-4 content-center">
                      <div className="card card-login card-plain">
                          <form className="form" onSubmit={this.handleSubmit}>
                              <div className="content">
                                  <div className="input-group form-group-no-border input-lg">
                                      <input name="adresse_logement" type="text" className="form-control" placeholder="Adresse" onChange={(event) => this.handleInputChange(event)}/>
                                  </div>
                                  <div className="input-group form-group-no-border input-lg">
                                      <input name="cp_logement" type="text" placeholder="Code postal" className="form-control" onChange={(event) => this.handleInputChange(event)}/>
                                  </div>
                                   <div className="input-group form-group-no-border input-lg">
                                        <select id="select" defaultValue="0" name="nom_region" className="form-control" onChange={(event) => this.handleInputChange(event)}>
                                          <option disabled>Selectionner la region</option>
                                          <option value="Grand-Est">Grand-Est</option>
                                          <option value="Aquitaine-Limousin-Poitou-Charentes">Aquitaine-Limousin-Poitou-Charentes</option>
                                          <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
                                          <option value="Bourgogne-Franche-Comte">Bourgogne-Franche-Comte</option>
                                          <option value="Centre-Val de Loire">Centre-Val de Loire</option>
                                          <option value="Corse">Corse</option>
                                          <option value="Île-de-France">Île-de-France</option>
                                          <option value="Languedoc-Roussillon-Midi-Pyrénées">Languedoc-Roussillon-Midi-Pyrénées</option>
                                          <option value="Haut-de-France">Haut-de-France</option>
                                          <option value="Normandie">Normandie</option>
                                          <option value="Pays-de-la-Loire">Pays-de-la-Loire</option>
                                          <option value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d'Azur</option>
                                        </select>
                                  </div>
                                  <div className="input-group form-group-no-border input-lg">
                                      <input name="image_region" type="file" className="form-control" name="image" onChange={(event) => this.handleInputChange(event)}/>
                                  </div>
																	<div>
																		{this.state.image_file != "" && <img  className="image-preview"src={this.state.image_file} />}
																	</div>
                                   <div className="input-group form-group-no-border input-lg">
                                      <textarea name="description_logement" className="form-control" placeholder="Description" rows="4" onChange={(event) => this.handleInputChange(event)}></textarea>
                                  </div>
                              </div>
                              <div className="footer text-center">
                                  <input type="submit" className="btn btn-primary btn-round btn-lg btn-block" disabled={!this.state.formValid} value="Ajouter un logement"></input>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    )
  }
}

export default AddHouse;
