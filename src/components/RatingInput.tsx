import starNull from "./../assets/star-null.svg";
import starFull from "./../assets/star-full.svg";
import "./RatingInput.css";

interface RatingInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const RatingInput = ({ label, value, onChange }: RatingInputProps) => {
  return (
    <div className="RatingInput">
      <h4 className="rating-input-label">{label}</h4>
      <div className="rating-input-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <img
            key={star}
            src={star <= value ? starFull : starNull}
            alt={`${star}점`}
            onClick={() => onChange(star)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>
      <h4 className="rating-input-value">{value}</h4>
    </div>
  );
};

export default RatingInput;
