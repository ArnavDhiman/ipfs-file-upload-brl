### AIM
The aim of this application is to let the user upload an image to the IPFS, return the hash and mint an NFT using the retured IPFS hash.<br />
The hash is displayed after the image is upload and can be downloaded in a json format.<br />
<br /><br />
The json looks like:<br />
```
{
  "attributes":
  [{"size":size},{"date_created":"date_created"},{"ipfs_hash":"ipfs_hash"}],
  "description":"image description",
  "name":"image name",
  "image":"ipfs hash link to the file"
}
```
<br /><br />
This app uses external IPFS called "ipfs.infura.io" but if local IPFS is to be used, the ipfs-link can be changed in /src/ipfs.js
