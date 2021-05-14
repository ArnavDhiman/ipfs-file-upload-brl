### AIM
The aim of this application is to let the user upload an image to the IPFS and return the hash.
The hash is displayed after the image is upload and can be downloaded in a json format.

The json looks like:
{
  "name":"Name of the File",
  "size":sizr,
  "date_created":"Original file creation date and time(UTC)",
  "ipfs_hash":"hash of the file on IPFS",
  "ipfs_link":"the ipfs link to the file(after appending the hash)"
}

This app uses external IPFS called "ipfs.infura.io" but if local IPFS is to be used, the ipfs-link can be changed in /src/ipfs.js
