interface RewardItemProps {
  reward: any // use your Reward interface if typed
  purchased: boolean
}

const RewardItem = ({ reward, purchased }: RewardItemProps) => {
  const { name, description, image_url, points_required } = reward.attributes

  return (
    <div
      className={`rounded-lg shadow p-4 transition ${
        purchased ? 'opacity-50 pointer-events-none' : 'hover:shadow-lg'
      }`}
    >
      <img
        src={image_url || '/placeholder.png'}
        alt={name}
        className="w-full h-32 object-contain mb-3"
      />
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-neutral-600">{description}</p>
      <p className="mt-2 font-medium">{points_required} coins</p>
      {purchased && <p className="text-xs text-green-600 mt-1">Purchased</p>}
    </div>
  )
}

export default RewardItem
