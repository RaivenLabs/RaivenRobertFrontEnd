console.log('Raw NODE_ENV:', process.env.NODE_ENV);
console.log('Raw REACT_APP_ENV:', process.env.REACT_APP_ENV);
console.log('Raw REACT_APP_MASTERURL:', process.env.REACT_APP_MASTERURL);
console.log('Raw REACT_APP_GIRAFFE:', process.env.REACT_APP_GIRAFFE);
console.log('Raw REACT_APP_PANTHER:', process.env.REACT_APP_PANTHER);

const coreconfig = {
    apiUrl: process.env.REACT_APP_MASTERURL,
    environment: process.env.REACT_APP_ENV,
    s3Bucket: process.env.REACT_APP_S3_BUCKET,
    giraffe: process.env.REACT_APP_GIRAFFE,
    panther: process.env.REACT_APP_PANTHER
};

console.log('Full config object:', coreconfig);
console.log(`Running in ${coreconfig.environment} mode`);
console.log(`Using API URL: ${coreconfig.apiUrl}`);

export default coreconfig;
