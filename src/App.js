import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react'
import ipfs from './ipfs'
import ImageUploader from 'react-images-upload';
import { Col, Container, Navbar, Row, Button, Spinner, Image, Table, Modal } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: null,
      buffer: null,
      upload_result: null,
      ipfs_hash: "",
      upload_json: null,
      show:false,
      mintStatus:null,
      
    }
    this.handleUpload = this.handleUpload.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.handleJson = this.handleJson.bind(this);
    this.downloadFileHandler = this.downloadFileHandler.bind(this);
    this.mintRequestHandler = this.mintRequestHandler.bind(this);
    this.mintNFTHandler = this.mintNFTHandler.bind(this);
  }

  handleUpload(event) {
    event.preventDefault();
    this.loadingShow();
    ipfs.files.add(this.state.buffer, (error, result) => {
      if (error) {
        console.error(error);
        return
      }
      this.setState(prevState => {
        return {
          image: prevState.image,
          buffer: prevState.buffer,
          upload_result: prevState.upload_result,
          upload_json: prevState.upload_json,
          ipfs_hash: result[0].hash,
          show:prevState.show,
          mintStatus:prevState.mintStatus,
        }
      });
      this.handleJson();
      console.log("Buffer -> ", this.state);
      this.loadingHide();
    })
  }
  onDrop(picture) {
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(picture[0]);
    reader.onloadend = () => {
      this.setState(prevState => {
        return {
          image: picture,
          buffer: Buffer(reader.result),
          upload_result: prevState.upload_result,
          upload_json: prevState.upload_json,
          ipfs_hash: prevState.ipfs_hash,
          show:prevState.show,
          mintStatus:prevState.mintStatus,
        }
      })
    }
  }
  handleJson() {
  
    let jsonFileInfo;
    jsonFileInfo = {
      "attributes" : [ {
        'size': this.state.image[0].size,
      }, {
        'date_created': new Date(this.state.image[0].lastModified).toUTCString(),
      },{
        'ipfs_hash': this.state.ipfs_hash,
      } ],
      "description":"Test NFT for BRL",
      'name': this.state.image[0].name.split(".")[0],
      "image": `https://ipfs.io/ipfs/${this.state.ipfs_hash}`,
    }
    this.setState(prevState => {
      return {
        image: prevState.image,
        buffer: prevState.buffer,
        upload_result: prevState.upload_result,
        upload_json: jsonFileInfo,
        ipfs_hash: prevState.ipfs_hash,
        show:prevState.show,
        mintStatus:prevState.mintStatus,
      }
    });
  }
  loadingShow(){
    this.setState(prevState => {
      return {
        image: prevState.image,
        buffer: prevState.buffer,
        upload_result: prevState.upload_result,
        upload_json: prevState.upload_json,
        ipfs_hash: prevState.ipfs_hash,
        show:true,
        mintStatus:prevState.mintStatus,
      }
    });
  }
  loadingHide(){
    this.setState(prevState => {
      return {
        image: prevState.image,
        buffer: prevState.buffer,
        upload_result: prevState.upload_result,
        upload_json: prevState.upload_json,
        ipfs_hash: prevState.ipfs_hash,
        show:false,
        mintStatus:prevState.mintStatus,
      }
    });
  }
  async mintNFTHandler(){
    this.loadingShow();
    const jsonData = this.state.upload_json;
    const json = JSON.stringify(jsonData);
    const buff = new Buffer.from(json);    
    await ipfs.files.add(buff, (error, result) => {
      if (error) {
        console.error(error);        
      }
      else{
        console.log("Meta file result = ",result);
        console.log('link:= ',`https://ipfs.io/ipfs/${result[0].hash}`)        
        this.mintRequestHandler(result[0].hash);        
      }
    });
    
  }
  async mintRequestHandler(fileHash){
    const data = {
      "file_hash" : fileHash,
      "file_link" : `https://ipfs.io/ipfs/${fileHash}`
    };
    console.log("Minter Data = ",data);
  
    const url = "http://localhost:9000/mint";
    const reqMeta = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    fetch(url, reqMeta).then(
      this.setState(prevState => {
        return {
          image: prevState.image,
          buffer: prevState.buffer,
          upload_result: prevState.upload_result,
          upload_json: prevState.upload_json,
          ipfs_hash: prevState.ipfs_hash,
          show:prevState.show,
          mintStatus:"Check Alchamey dashboard for the status of txn.",
        }
      })
    );
    // const respJson = await response.json();

    
    
    console.log("changed state = ", this.state)
    this.loadingHide();
  }
  async downloadFileHandler() {
    const jsonData = this.state.upload_json;
    const fileName = jsonData.name;
    const json = JSON.stringify(jsonData);
    const blob = new Blob([json], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  render() {
    let file_table;
    if (this.state.upload_json) {
      file_table = <Table responsive striped bordered hover className="table-file">
        <thead>
        <tr>
            <td>
              File Name
          </td>
            <td>
              File Size
          </td>          
          
          <td>
            Download
          </td>
          <td>
            Mint NFT
          </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {this.state.upload_json.name}
            </td>
            <td>
              {this.state.upload_json.attributes[0].size}
            </td>         
          
            <td>
                <Button variant="light" onClick={this.downloadFileHandler}>Download JSON</Button> 
            </td>
            <td>
                <Button variant="light" onClick={this.mintNFTHandler}>MINT NFT</Button> 
            </td>
          </tr>
        </tbody>
      </Table>
    }
    return (
      <>
      <div className="app-body">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">
            IPFS File Uploader
          </Navbar.Brand>
        </Navbar>
        <Container fluid>
          <br></br>
          <Row>
            <Col className="text-center">
              <h2>Upload Image</h2>
              <br></br>
              <ImageUploader
                withIcon={true}
                buttonText='Choose image'
                onChange={this.onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
              />
              <Button variant="success" onClick={this.handleUpload}>Upload image
                  <Spinner className="wait-spinner" animation="grow" size="sm" hidden />
              </Button>

            </Col>
          </Row>
          <Row className = "file-meta">                                
            <Col className="json-obj" xs='auto'>
                {file_table}
            </Col>
            <Col className="upladed-image">
              {this.state.ipfs_hash ? <Image className="img-thumbnail" thumbnail src={`https://ipfs.io/ipfs/${this.state.ipfs_hash}`}></Image> : <p></p>}
            </Col> 
          </Row>
        </Container>
        <Container>
          <Row>
            <Col>
              {this.state.mintStatus ? <p>{this.state.mintStatus}</p> : <p></p>}
            </Col>

          </Row>
        </Container>
      </div>
      <Modal      
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      show={this.state.show}
      onHide={this.loadingHide}>
      <Modal.Body className="loadingBody"  animation={false}>  
           <Spinner animation="border" variant="info" />   
      </Modal.Body>
    </Modal></>
    )
  }
}
export default App;
