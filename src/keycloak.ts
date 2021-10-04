import Keycloak from 'keycloak-js'
// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = Keycloak({
  url: 'https://auth.mint.isi.edu/auth',
  realm: 'production',
  clientId: 'mint-ui',
});

export default keycloak;