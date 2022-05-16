import "./empty.css";

function Empty(props) {
  return (
    <div className="Empty">
      <img src={props.emptyImage} alt="empty" />
      {props.pageNotFound !== true && (
        <h3>Your {props.emptyTitle} seems to be empty!</h3>
      )}
    </div>
  );
}

export default Empty;
