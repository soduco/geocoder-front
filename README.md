# geocoder-front

Pour les testeurs : 

  Pour tester l'application sur http://localhost:4200/ :
  
  - clonner le repo git :
  
  ```bash
  git clone https://github.com/soduco/geocoder-front.git
  cd geocoder-front
  ```

  - Lancer l'application : 
  
  ```bash
  ng serve
  ```

Pour les développeurs : 

  Pour déployer l'application sur http://dev-geocode.geohistoricaldata.org/ il faut : 
  
  - Se connecter à la VM : 

  ```bash
  ssh -i PATH_VERS_VOTRE_CLE_SSH@134.158.75.49
  ```

  - Lancer ces commandes :

  ```bash
  cd test
  ng serve --open --port 4200 --configuration production
  ```
  
Pour l'instant il n'y a pas de Docker pour le faire.
