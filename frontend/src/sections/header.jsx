import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaChevronDown } from 'react-icons/fa';
import { MdAttachMoney } from "react-icons/md";

function Header() {
//   const scrollToSection = (sectionId) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

  return (
    <section id="inicio" className="hero-section">
      <Container>
        <Row className="align-items-center">
          <Col lg={7} className="text-center text-lg-start" data-aos="fade-right">
                <h1 className='title'>GastAi <MdAttachMoney /></h1>
                 <p>Tu Asistente de Gastos Inteligente</p>
            <Button className="btn-primary-custom mx-auto mx-lg-0 mb-2 d-block d-lg-inline-block" href="#features">
              ¡Comienza Gratis Ahora!
            </Button>

          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Header;
