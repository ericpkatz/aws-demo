import React, { Component } from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';

const root = document.getElementById('root');


class Buckets extends Component{
  constructor(){
    super();
    this.state = {
      buckets: []
    };
  }
  componentDidMount(){
    axios.get('/api/buckets')
      .then( response => response.data)
      .then( buckets => this.setState({ buckets }));
  }
  render(){
    const { buckets } = this.state;
    return (
      <_Buckets buckets={ buckets }/>
    );
  }
}

const _Buckets = ({ buckets })=> {
  return (
    <div>
      <h1>Buckets</h1>
      <ul>
      {
        buckets.map( bucket => (
          <li key={ bucket.Name }>
            <Link to={`/buckets/${bucket.Name}`}>
            { bucket.Name }
            </Link>
          </li>
        ))
      }
      </ul>
    </div>
  );
}

class Bucket extends Component{
  constructor(){
    super();
    this.state = {
      bucket: '',
      objects: [],
      data: ''
    };
    this.setData = this.setData.bind(this);
    this.upload = this.upload.bind(this);
    this.loadData = this.loadData.bind(this);
  }
  loadData(){
    const bucket = this.props.match.params.bucket; 
    axios.get(`/api/buckets/${bucket}`)
      .then( response => response.data)
      .then( objects => {
        this.setState({
          bucket,
          objects,
          data: ''
        });
      }); 
  }
  upload(){
    axios.post(`/api/buckets/${this.state.bucket}`, { data: this.state.data})
    .then(() => this.loadData())
  }
  setData(data){
    this.setState({ data });
  }
  componentDidMount(){
    this.loadData();
  }
  render(){
    const { bucket, objects, data } = this.state;
    const { setData, upload } = this;
    return (
      <_Bucket setData={ setData }  bucket={ bucket } objects={ objects } data={ data } upload={ upload }/>
    );
  }
}

const _Bucket = ({ bucket, objects, data, setData, upload })=> {
  const onChangeFile = (ev) => {
    const file = ev.target.files[0];
    const fileReader = new FileReader();

    fileReader.addEventListener('load', (ev)=> {
      setData(ev.target.result);
    });

    fileReader.readAsDataURL(file);
  };

  return (
    <div>
      <h1>{ bucket }</h1>
      <h2><Link to='/'>All Buckets</Link></h2>
      <input type='file' onChange={ onChangeFile } />
      <button disabled={ data.length === 0 } onClick={ upload }>Upload</button>
      <ul>
      {
        objects.map( object => (
          <li key={ object.Key }>
            <img src={ `https://s3.amazonaws.com/${bucket}/${object.Key}` } />
          </li>
        ))
      }
      </ul>
    </div>
  );
}

const App = ()=> {
  return (
    <Router>
      <div>
        <Route exact path='/' component={ Buckets } />
        <Route path='/buckets/:bucket' component={ Bucket } />
      </div>
    </Router>
  );
};



render(<App />, root);
