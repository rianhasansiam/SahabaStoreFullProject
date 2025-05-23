import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const orderStats = {
    new: 0,
    pending: 0,
    delivered: 0,
    total: 0
  };

  const chartData = [
    { name: 'Jan', orders: 100 },
    { name: 'Feb', orders: 200 },
    { name: 'Mar', orders: 150 },
    { name: 'Apr', orders: 300 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="New Orders" 
          value={orderStats.new} 
          trend="down" 
          percentage="20%" 
        />
        <StatCard 
          title="Pending Orders" 
          value={orderStats.pending} 
          trend="down" 
          percentage="11%" 
        />
        <StatCard 
          title="Delivered Orders" 
          value={orderStats.delivered} 
          trend="down" 
          percentage="18%" 
        />
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <BarChart width={800} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, percentage }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <p className="text-3xl font-bold my-2">{value}</p>
    <p className={`${trend === 'down' ? 'text-red-500' : 'text-green-500'} flex items-center`}>
      <TrendIcon trend={trend} />
      <span>{percentage} {trend === 'down' ? 'decrease' : 'increase'}</span>
    </p>
  </div>
);

const TrendIcon = ({ trend }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5" 
    viewBox="0 0 20 20" 
    fill="currentColor"
    style={trend === 'up' ? { transform: 'rotate(180deg)' } : {}}
  >
    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

export default Dashboard;