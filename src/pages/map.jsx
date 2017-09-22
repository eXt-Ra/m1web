import React from 'react';
import ListHousing from './../organisms/ListHousing/ListHousing';
import MapContainer from './../organisms/MapContainer/MapContainer';
import NoHouse from './../organisms/NoHouse/NoHouse';
import '../../styles/index.scss';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class Map extends React.Component {
	constructor(props) {
		super(props);
		this.handleItemListClick = this.handleItemListClick.bind(this);
		this.setStateCenter = this.setStateCenter.bind(this);
		this.onToggleOpen = this.onToggleOpen.bind(this);
		this.handleFilterChange = this.handleFilterChange.bind(this);

		this.state = {
			housing: [],
			filterhousing: [],
			map: {
				center: {
					lat: 47.698059,
					lng: 2.624758
				},
				zoom: 11
			},
			isLoading : true,
			Redirect : false
		};
	}
	componentWillMount(){
		axios.get(`http://localhost:8888/api.php?region=${this.props.match.params.region}`).then(res => {
			console.log(res.data);
			if (res.data.length == 0) {
				this.setState({
					Redirect: true
				})
			}else {
				console.log(res.data);
				this.setState({
					filterhousing: res.data.map((item)=>{
						item.isOpen = false;
						item.coord = {
							lat: Number(item.coord.replace('POINT(','').replace(')','').split(' ')[1]),
							lng: Number(item.coord.replace('POINT(','').replace(')','').split(' ')[0])
						};
						return item;
					}),
					housing:res.data.map((item)=>{
						item.isOpen = false;
						return item;
					})
				},()=>{
					this.setState({
						isLoading: false
					})
				});
			}
		});
	}
	handleFilterChange(input) {
		return new Promise((resolve) => {
			if (input.target.value === "") {
				this.setState({
					filterhousing: this.state.housing
				}, () => {
					let bounds = new google.maps.LatLngBounds;
					this.state.filterhousing.map((house, index) => {
						bounds.extend(house.coord)
					});
					this.setStateCenter(bounds.getCenter())
				});
			} else {
				this.setState({
					filterhousing: this.state.housing.filter(element => {
						return element.cp.toString().indexOf(input.target.value) !== -1;
					})
				}, () => {
					let bounds = new google.maps.LatLngBounds;
					this.state.filterhousing.map((house, index) => {
						bounds.extend(house.coord)
					});
					this.setStateCenter(bounds.getCenter())
				});
			}
			resolve();
		});
	}
	handleItemListClick(e, targetHouse) {
		if (!e.target.classList.contains("list-item")) {
			const el = findAncestor(e.target,"list-item");
			const list = findAncestor(el,"list-wrapper");
			Array.from(list.children).forEach((elem)=>{
				elem.classList.remove("active");
			});
			el.classList.add("active");
			console.log(el);
		}
		this.setState({
			map: {
				center: targetHouse.coord
			},
			filterhousing: this.state.filterhousing.map(house => {
				if (house === targetHouse) {
					house.isOpen = true;
				} else {
					house.isOpen = false;
				}
				return house;
			})
		})
	}
	onToggleOpen(targetHouse) {
		this.setState({
			filterhousing: this.state.filterhousing.map(house => {
				if (house === targetHouse) {
					house.isOpen = !house.isOpen;
					return house;
				}
				return house;
			})
		});
	}
	setStateCenter(newCenter) {
		this.setState({
			map: {
				center: newCenter,
				zoom: 8
			}
		})
	}
	render() {
		return (
			<div>
				{this.state.Redirect &&
					<div className="row">
						<NoHouse/>
					</div>
     		}
				{!this.state.isLoading &&
					<div className="row">
						<ListHousing region = {this.props.match.params.region} handleItemListClick={this.handleItemListClick} handleFilterChange={this.handleFilterChange} housing={this.state.filterhousing}/>
						<MapContainer housing={this.state.filterhousing} setStateCenter={this.setStateCenter} center={this.state.map.center} onToggleOpen={this.onToggleOpen} zoom={this.state.map.zoom}/>
				</div>}
			</div>
		)
	}
}

function findAncestor(el, cls) {
	while ((el = el.parentElement) && !el.classList.contains(cls));
	return el;
}
