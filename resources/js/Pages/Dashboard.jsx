import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head,usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import dayjs from 'dayjs';

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
    booksBorrowCountThisWeek,
    membersCountThisWeek,
    weeklyBorrowedReturnActivity,
  } = usePage().props;

  console.log(weeklyBorrowedReturnActivity);

  // Borrowing trend (real data from backend)
  const borrowingTrend = useMemo(() => {
    const labels = Object.keys(borrowBookLast7Months).map(month =>
      dayjs(month, 'YYYY-MM').format('MMM YYYY') // convert "2025-03" → "Mar 2025"
    );
    const data = Object.values(borrowBookLast7Months);

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

  // Placeholder: Weekly activity
  // ...
// Placeholder removed: Weekly activity now from backend
const weeklyActivity = useMemo(() => {
  const labels = Object.keys(weeklyBorrowedReturnActivity).map(date =>
    dayjs(date).format("ddd") // e.g. "Thu"
  );

  const borrowedData = Object.keys(weeklyBorrowedReturnActivity).map(date => {
    const borrowed = weeklyBorrowedReturnActivity[date].find(
      item => item.action === "borrowed"
    );
    return borrowed ? borrowed.total : 0;
  });

  const returnedData = Object.keys(weeklyBorrowedReturnActivity).map(date => {
    const returned = weeklyBorrowedReturnActivity[date].find(
      item => item.action === "returned"
    );
    return returned ? returned.total : 0;
  });

  return {
    labels,
    datasets: [
      {
        label: "Borrowed",
        data: borrowedData,
        backgroundColor: "#3b82f6",
      },
      {
        label: "Returned",
        data: returnedData,
        backgroundColor: "#10b981",
      },
    ],
  };
}, [weeklyBorrowedReturnActivity]);



  // Placeholder: Inventory split
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
          stepSize: 10, // adjust depending on values
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
         
          </div>

  {/* KPI Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { 
          label: 'Total Books', 
          value: bookCount, 
          color: 'blue' 
        },
        { 
          label: 'Active Members', 
          value: memberCount, 
          color: 'green',
          extra: { label: 'This Week', value: membersCountThisWeek }
        },
        { 
          label: 'Books Borrowed Today', 
          value: borrowBookToday, 
          color: 'yellow',
          extra: { label: 'This Week', value: booksBorrowCountThisWeek }
        },
        { 
          label: 'Overdue Books', 
          value: overDueBooks, 
          color: 'red' 
        },
      ].map((card, idx) => (
        <div 
          key={idx} 
          className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">{card.label}</div>
            <span className={`w-3 h-3 rounded-full bg-${card.color}-500`}></span>
          </div>

          {/* Main Value */}
          <div className={`mt-2 text-3xl font-bold text-${card.color}-600`}>
            {card.value}
          </div>

          {/* Extra info */}
          {card.extra && (
            <div className="mt-2 flex items-center space-x-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {card.extra.label}
              </span>
              <span className="font-semibold text-gray-800">{card.extra.value}</span>
            </div>
          )}
        </div>
      ))}
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
                <Doughnut
                  data={inventorySplit}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } },
                  }}
                />
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
