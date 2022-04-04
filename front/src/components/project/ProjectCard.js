import { Card, Button, Row, Col } from "react-bootstrap";
import * as Api from "../../api";

function ProjectCard({ project, setProjects, isEditable, setIsEditing }) {

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await Api.delete("projects", project.id);
    } catch (err) {
      console.log("삭제 중 에러가 발생했습니다.", err);
    }
    setProjects((e) => {
      const delProject = e.filter((v) => v.id !== project.id);
        return delProject;    
    });
  };

  return (
    <Card.Text>
      <Row className="justify-content-between align-items-center mb-2">
        <Col>
          {project.title}
          <br />
          <span className="text-muted">{project.description}</span>
          <br />
          <span className="text-muted">
            {`${project.from_date} ~ ${project.to_date}`}
          </span>
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

export default ProjectCard;
