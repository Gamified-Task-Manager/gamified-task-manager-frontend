import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';

interface CoinPouchProps {
  totalCoins: number;
}

const CoinPouch = ({ totalCoins }: CoinPouchProps) => {
  const navigate = useNavigate();

  const handleClick = () => navigate('/rewards'); // redirects to rewards page

  return (
    <div 
      onClick={handleClick}
      className="flex items-center gap-2 cursor-pointer bg-yellow-100 px-4 py-2 rounded-xl shadow-md hover:bg-yellow-200 transition"
    >
      <FontAwesomeIcon icon={faSackDollar} className="text-yellow-500 text-2xl" />
      <span className="font-semibold text-lg text-neutral-700">
        <CountUp end={totalCoins} duration={1} />
      </span>
    </div>
  );
};

export default CoinPouch;
