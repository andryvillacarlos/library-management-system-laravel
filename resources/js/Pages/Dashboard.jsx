import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const {
    bookCount,
    memberCount,
    borrowBookToday,
    overDueBooks,
    borrowBookLast7Months,
  } = usePage().props;

  // Borrowing trend (real data from backend)
  const borrowingTrend = useMemo(() => {
    const labels = Object.keys(borrowBookLast7Months);   // e.g. ["Mar 2025", "Apr 2025", ...]
    const data = Object.values(borrowBookLast7Months);   // e.g. [12, 9, 15, ...]
    
    console.log(Object.keys(borrowBookLast7Months));
      console.log(Object.values(borrowBookLast7Months));
    return {
      labels,
      datasets: [
        {
          label: 'Books Borrowed',
          data,
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6',
          borderWidth: 2,
          fill: false,
          tension: 0.35,
        },
      ],
    };
  }, [borrowBookLast7Months]);

  // Placeholder: Weekly activity (can be wired to backend later)
  const weeklyActivity = useMemo(() => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Borrowed',
        data: [45, 52, 39, 60, 70, 48, 55],
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Returned',
        data: [38, 45, 32, 55, 62, 42, 50],
        backgroundColor: '#10b981',
      },
    ],
  }), []);

  // Placeholder: Inventory split (can be wired to backend later)
  const inventorySplit = useMemo(() => ({
    labels: ['Available', 'Borrowed', 'Reserved', 'Lost/Damaged'],
    datasets: [
      {
        label: 'Books',
        data: [1240, 420, 80, 12],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
      },
    ],
  }), []);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { drawBorder: false },
        ticks: {
          stepSize: 100,   // 👈 gap of 100
        },
      },
      x: { grid: { display: false } },
    },
  };


  return (
    <>
      <Head title="Dashboard" />
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Library Dashboard</h1>
            <div className="text-sm text-gray-500">Updated just now</div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Total Books</div>
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              </div>
              <div className="mt-2 text-3xl font-bold text-blue-600">{bookCount}</div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Active Members</div>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <div className="mt-2 text-3xl font-bold text-green-600">{memberCount}</div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Books Borrowed Today</div>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              </div>
              <div className="mt-2 text-3xl font-bold text-yellow-600">{borrowBookToday}</div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Overdue Books</div>
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
              </div>
              <div className="mt-2 text-3xl font-bold text-red-600">{overDueBooks}</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line Chart */}
            <div className="rounded-2xl border bg-white p-4 shadow-sm h-80 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Borrowing Trend</h2>
                <span className="text-xs text-gray-500">Last 7 months</span>
              </div>
              <div className="h-[calc(100%-2rem)]">
                <Line data={borrowingTrend} options={commonOptions} />
              </div>
            </div>

            {/* Doughnut */}
            <div className="rounded-2xl border bg-white p-4 shadow-sm h-80">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Inventory Split</h2>
                <span className="text-xs text-gray-500">Live</span>
              </div>
              <div className="h-[calc(100%-2rem)]">
                <Doughnut data={inventorySplit} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } },
                }} />
              </div>
            </div>

            {/* Bar Chart */}
            <div className="rounded-2xl border bg-white p-4 shadow-sm h-80 lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Weekly Borrow/Return Activity</h2>
                <span className="text-xs text-gray-500">This week</span>
              </div>
              <div className="h-[calc(100%-2rem)]">
                <Bar data={weeklyActivity} options={commonOptions} />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
