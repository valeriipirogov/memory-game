interface CardComponentProps {
  id: number;
  value?: number;
  image?: string;
  className?: string;
  flipped?: boolean;
  onClick?: (cardId: number) => void;
}

const CardComponent = (props: CardComponentProps) => {
  const { className, id, image, value, onClick, flipped = false } = props;
  return (
    <div className={className} onClick={() => onClick?.(id)}>
      {image ? (
        <img
          className="image"
          src={image}
          style={{ visibility: flipped ? "visible" : "hidden" }}
        ></img>
      ) : value ? (
        flipped ? (
          value
        ) : (
          ""
        )
      ) : (
        ""
      )}
    </div>
  );
};

export default CardComponent;
