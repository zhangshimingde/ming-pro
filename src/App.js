import React,{Component} from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Layout, LocaleProvider } from 'antd';
import DragTabs from './components/DragTabs/index.js';
import MainContainer from './components/Container/MainContainter/index.js';
const { Sider, Content,Header,Footer } = Layout;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    componentDidMount() {
        
    }
    render() {
        return (
            <div className="App" style={{height:'100%'}}>
                <Layout style={{backgroundColor:'#f1f4f6',height:'100%'}}>
                    <Header style={{height:'50px',backgroundColor:'#2b3a48',lineHeight:'50px',paddingLeft:'10%'}}>
                        <img src={require("./assets/img/logo.png")} alt=""/>
                    </Header>
                    <Layout style={{margin:'0 10%',height:'calc(100% - 50px)'}}>
                        <Sider width="300" style={{backgroundColor:'#fff',marginRight:'20px',height:'100%'}}>
                            <DragTabs/>
                        </Sider>
                        <Content style={{backgroundColor:'#fff',height:'100%'}}>
                            <MainContainer/>
                        </Content>
                    </Layout>
                </Layout> 
            </div>
        );
    }
}

export default App;
