export default function ReviewCard({ review }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-blue-400">{review.user} 
        <span className="text-yellow-400">⭐ {review.rating}/5</span></h3>
      </div>

      <p className="text-gray-300">{review.comment}</p>
    </div>
  );
}