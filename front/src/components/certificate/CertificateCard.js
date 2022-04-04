import { Card, Button, Row, Col } from "react-bootstrap";
import * as Api from "../../api";

function CertificateCard({ certificate, setCertificates, isEditable, setIsEditing }) {

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await Api.delete("certificates", certificate.id);
    } catch (err) {
      console.log("삭제 중 에러가 발생했습니다.", err);
    }
    setCertificates((e) => {
      const delCertificate = e.filter((v) => v.id !== certificate.id);
        return delCertificate;    
    });
  };

  return (
    <Card.Text>
      <Row className="align-items-center">
        <Col>
          {certificate.title}
          <br />
          <span className="text-muted">{certificate.description}</span>
          <br />
          <span className="text-muted">{certificate.when_date}</span>
        </Col>
        {isEditable && (
          <Col xs lg="1">
            <Button
              variant="outline-info"
              size="sm"
              onClick={() => setIsEditing((prev) => !prev)}
              className="mr-3"
            >
              편집
            </Button>
            <Button
              variant="outline-danger"              
              size="sm"
              onClick={handleDelete}
              className="mr-3"
            >
              삭제
            </Button>
          </Col>
        )}
      </Row>
    </Card.Text>
  );
}

export default CertificateCard;
