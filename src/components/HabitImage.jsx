const HabitImage = ({ habitType }) => {

  return <div style={{backgroundImage: `url(/imgs/${habitType}.jpg)`}}className="user-habit__image" />;
};

export default HabitImage;
