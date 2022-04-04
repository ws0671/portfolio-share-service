import { Card, Button, Row, Col } from "react-bootstrap";
import * as Api from "../../api";

function AwardCard({ award, awards, setAwards, isEditable, setIsEditing }) {

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await Api.delete("awards", award.id);
    } catch (err) {
      console.log("삭제 중 에러가 발생했습니다.", err);
    }
    setAwards((e) => {
      const delAward = e.filter((v) => v.id !== award.id);
        return delAward;    
    });
  };

  return (
    <Card.Text>
      <Row className="align-items-center">
        <Col>
          <span>{award.title}</span>
          <br />
          <span className="text-muted">{award.description}</span>
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

export default AwardCard;
