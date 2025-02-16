import { ActivityItem } from '../types/dashboard'

interface ActivityLogProps {
  activities: ActivityItem[];
}

export default function ActivityLog({ activities }: ActivityLogProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
      <ul className="space-y-4">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
            <div>
              <p className="text-sm text-gray-600">{activity.message}</p>
              <span className="text-xs text-gray-400">{activity.timestamp}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

