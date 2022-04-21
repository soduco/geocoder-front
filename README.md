<div align="center" id="top"> 
  <img src="https://github.com/soduco/geocoder-front/blob/Antoine/Style/src/assets/logo_HistoGeo.png" alt="HistoGéo" />

  &#xa0;

  <a href="https://github.com/soduco/geocoder-front/blob/Antoine/Style/Demo/Animation_short_boucle_reduced2.gif">Demo</a>
  
</div>

<h1 align="center"> HistoGéo, le front-end du géocodeur historique </h1>

<p align="center">
  
</p>

<!-- Status -->

<!-- <h4 align="center"> 
	🚧  My App 🚀 Under construction...  🚧
</h4> 

<hr> -->

<p align="center">
  <a href="#dart-description">Description</a> &#xa0; | &#xa0; 
  <a href="#sparkles-fonctionnalités">Fonctionnalités</a> &#xa0; | &#xa0;
  <a href="#rocket-technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-conditions-requises-pour-lancer-le-projet-en-local">Conditions requises pour lancer le projet en local</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-lancement-du-projet-en-local">Lancement du projet en local</a> &#xa0; | &#xa0;
  <a href="#memo-license">License</a> &#xa0; | &#xa0;
  <a href="https://github.com/Antoine-overflow" target="_blank">Author</a>
</p>

<br>

## :dart: Description ##

Ce projet est le front-end du géocodeur historique développé par 5 étudiants de l'ENSG - Géomatique : Théo Huard, Roaa Masri, Maïlys Monge, Antoine Rainaud et Adrienne Zebaze pour l'IGN, l'EHESS, les Archives Nationales et EPITA.

Le géocodeur historique permet l'action de géocodage : transformer une adresse indirecte (adresse postale par exemple) en une adresse directe (latitude et longitude) sur une échelle de temps longue en prenant en compte les évolutions des adresses au fil du temps.

Notre application est déployée à l'adresse suivante : http://dev-geocode.geohistoricaldata.org/ et a pour but d'être accessible et utilisable par toute personne souhaitant faire du géocodage. 


<img src="https://github.com/soduco/geocoder-front/blob/Antoine/Style/Demo/Animation_short_boucle_reduced2.gif">

## :sparkles: Fonctionnalités ##

:heavy_check_mark: Fonctionnalité 1 : Importer un fichier CSV en parcourant les dossiers de son ordinateur ou bien en glissant-déposant le fichier. \
:heavy_check_mark: Fonctionnalité 2 : Visualiser les premières lignes du fichier importé pour vérifier l'encodage et les informations contenues dans le fichier. \
:heavy_check_mark: Fonctionnalité 3 : Sélectionner les colonnes de son fichier pour construire les adresses qui seront géocodées. \
:heavy_check_mark: Fonctionnalité 4 : Sélectionner les colonnes de son fichier ou choisir avec un calendrier la ou les date à laquelle on appliquera le géocodage.\
:heavy_check_mark: Fonctionnalité 5 : Géocodage des adresses données aux dates données. \
:heavy_check_mark: Fonctionnalité 6 : Télécharger un fichier CSV ou JSON contenant les résultats du géocodage. \
:heavy_check_mark: Fonctionnalité 7 : Visualiser dans un tableau intéractif et sur une carte intéractive les résultats du géocodage.\
:heavy_check_mark: Fonctionnalité 8 : Pouvoir changer les fonds de cartes en fonction de la date et pouvoir changer l'ordre des résultats du géocodage en fonction de l'analyse de l'utilisateur. 

## :rocket: Technologies ##

Les outils suivants ont été utilisé dans notre projet :

- [Angular](https://angular.io/)
- [Material Design](https://material.io/)
- [Bootstrap](https://getbootstrap.com/)
- [Leaflet](https://leafletjs.com/)
- [Mapbox](https://www.mapbox.com/)
- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)

## :white_check_mark: Conditions requises pour lancer le projet en local ##

Avant de commencer :checkered_flag:, vous devez avoir [Git](https://git-scm.com), [Angular](https://angular.io/) et [Node](https://nodejs.org/en/) d'installé.

## :checkered_flag: Lancement du projet en local ##

```bash
# Clone this project
$ git clone https://github.com/soduco/geocoder-front

# Access
$ cd geocoder-front

# Install dependencies, the force flag disable version issues
$ npm install --force

# Run the project
$ ng serve

# The server will initialize in the <http://localhost:4200>
```

## :memo: License ##

This project is under license for SODUCO, the team whom we worked with during the project.


Made with :heart: by <a href="https://github.com/Antoine-overflow" target="_blank"> Antoine Rainaud </a>

&#xa0;

<a href="#top">Retour en haut de page</a>
