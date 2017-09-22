# Déroulé du module

* Semaine d'intégration : **faire connaissance autour d'un projet**

* Créer des groupes de 4/5 membres

* Définir le rôle et le travail de chacun


# Intitulé

Création d'une application de location de logements entre particuliers

# Objectifs et fonctionnalités

* L'application n'est disponible que pour la France

* À partir de la sélection d'une région, l'application doit permettre de localiser les logements mis en location sur une carte

* La carte peut être glissée et déplacée vers une autre zone et ainsi afficher les logements disponibles dans cette zone

* Un espace d'administration est disponible pour l'administrateur et les utilisateurs

# Références

* MySQL
	* https://dev.mysql.com/doc/refman/5.7/en/spatial-extensions.html
	* https://dev.mysql.com/doc/refman/5.7/en/spatial-function-reference.html

* PostGIS
	* http://postgis.net/

* GeoJSON
	* http://geojson.org/

* API Google Maps
	* https://developers.google.com/maps/documentation/javascript/tutorial
	* https://developers.google.com/maps/documentation/javascript/examples/

* Données géographiques françaises
	* https://github.com/gregoiredavid/france-geojson

# Livrables de fin de semaine

* Disponibilité du code source et base de données sur GitHub

* Document décrivant les rôles et le travail de chacun des membres de l'équipe


# Notes

Json_DECODE
```php
<?php
stdClass::__set_state(array(
   'adresse' => '8 rue de beauregard',
   'CP' => 67000,
   'img' => 'c:/toto',
   'coord' =>
  stdClass::__set_state(array(
     'lat' => 45,
     'lng' => 6,
  )),
   'desc' => 'je suis une desc',
));
?>
```
