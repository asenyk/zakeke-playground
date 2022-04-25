
import './App.css';
import 'react-tippy/dist/tippy.css';

import React, { useEffect, useRef, useState } from 'react';
import { useZakeke } from 'zakeke-configurator-react';

import LoadingOverlay from 'components/widgets/LoadingOverlay';

import Viewer from 'components/layout/Viewer';
import Footer from 'components/layout/Footer';
import useStore from 'Store';

import Selector from 'components/layout/Selector';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-flow:column;
  padding:40px 60px;
`;

export const Top = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 40%;
  min-height:0;

  @media (max-width: 768px) {
    flex-direction: column;
    display: block;
  }
`;

function App() {

  const { isLoading } = useStore();
  const { isSceneLoading } = useZakeke();
  const [resize, setResize] = useState(false);

  const resizeRef = useRef(false);
  resizeRef.current = resize;

  // Page resize
  useEffect(() => {
    const resizeFunction = () => {
      setResize(!resizeRef.current);
    }

    window.addEventListener('resize', resizeFunction);
    return () => window.removeEventListener('resize', resizeFunction);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Top>
        <Selector />
        <Viewer />
      </Top>

      <Footer />

      {(isLoading || isSceneLoading) && <LoadingOverlay />}
    </Container>
  );
}

export default App;
