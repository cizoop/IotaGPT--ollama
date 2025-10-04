let IS_PROD=true;
const server=IS_PROD?
"https://bastionary-nonhazardous-micheline.ngrok-free.dev":
"http://localhost:8080"

export default server;