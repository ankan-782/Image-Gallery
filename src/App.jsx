import './App.css';
import Main from './components/layouts/Main';
import ActionBar from './containers/ActionBar';
import Gallery from './containers/gallery/index';
import LocalStorageContextProvider from './contexts/LocalStorageContextProvider';

function App() {
    return (
        <LocalStorageContextProvider>
            <Main>
                <ActionBar />
                <Gallery />
            </Main>
        </LocalStorageContextProvider>
    );
}

export default App;
