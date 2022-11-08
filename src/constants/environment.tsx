
export {};

declare global {
  interface Window {
    REACT_APP_AIRFLOW_API: string;
    REACT_APP_MIC_API: string;
    REACT_APP_MODEL_CATALOG_API: string;
  }
}

const REACT_APP_AIRFLOW_API : string = window.REACT_APP_AIRFLOW_API || 'https://airflow.mint.isi.edu/api/v1/';
const REACT_APP_MODEL_CATALOG_API : string = window.REACT_APP_MODEL_CATALOG_API || 'https://api.models.mint.isi.edu/v1.8.0';
const REACT_APP_MIC_API : string = window.REACT_APP_MIC_API || 'https://mic.mint.isi.edu';
export {
    REACT_APP_AIRFLOW_API,
    REACT_APP_MODEL_CATALOG_API,
    REACT_APP_MIC_API

}