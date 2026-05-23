import { useEffect, useState, useMemo } from 'react';
import { 
  getSalarySummaryByCountry, 
  getAverageByDepartment, 
  getAverageByJobTitle, 
  getAverageByDeptCountry, 
  getAverageByJobCountry 
} from '../api/dashboard.api';
import DataTable from '../components/data/DataTable';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import { formatCurrency } from '../utils/formatCurrency';
import countries from 'i18n-iso-countries';
import english from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(english);

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: [],
    dept: [],
    jobTitle: [],
    deptCountry: [],
    jobCountry: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          summaryRes,
          deptRes,
          jobTitleRes,
          deptCountryRes,
          jobCountryRes
        ] = await Promise.all([
          getSalarySummaryByCountry(),
          getAverageByDepartment(),
          getAverageByJobTitle(),
          getAverageByDeptCountry(),
          getAverageByJobCountry(),
        ]);
        
        setData({
          summary: summaryRes.data || summaryRes,
          dept: deptRes.data || deptRes,
          jobTitle: jobTitleRes.data || jobTitleRes,
          deptCountry: deptCountryRes.data || deptCountryRes,
          jobCountry: jobCountryRes.data || jobCountryRes,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCountry = (code) => countries.getName(code, 'en') || code;

  // 1. Summary Columns
  const summaryCols = [
    { key: 'country', header: 'Country', render: formatCountry },
    { key: 'headcount', header: 'Headcount' },
    { key: 'averageSalary', header: 'Avg Salary', render: (val) => formatCurrency(val, 'USD') },
    { key: 'minSalary', header: 'Min Salary', render: (val) => formatCurrency(val, 'USD') },
    { key: 'maxSalary', header: 'Max Salary', render: (val) => formatCurrency(val, 'USD') },
  ];

  // 2. Dept Columns
  const deptCols = [
    { key: 'name', header: 'Department' },
    { key: 'headcount', header: 'Headcount' },
    { key: 'averageSalary', header: 'Avg Salary', render: (val) => formatCurrency(val, 'USD') },
  ];

  // 3. Job Title Columns
  const jobCols = [
    { key: 'name', header: 'Job Title' },
    { key: 'headcount', header: 'Headcount' },
    { key: 'averageSalary', header: 'Avg Salary', render: (val) => formatCurrency(val, 'USD') },
  ];

  // Dynamic Column Builder for pivot tables
  const buildPivotColumns = (dataset) => {
    const cols = [{ key: 'country', header: 'Country', render: formatCountry }];
    if (!dataset || dataset.length === 0) return cols;

    // Get all keys except 'country' from the first row
    const keys = Object.keys(dataset[0]).filter(k => k !== 'country');
    
    keys.forEach(k => {
      cols.push({
        key: k,
        header: k, // Department or Job Title name
        render: (val) => {
          if (!val || val.headcount === 0) return '-';
          return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 500 }}>{formatCurrency(val.averageSalary, 'USD')}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{val.headcount} employees</span>
            </div>
          );
        }
      });
    });

    return cols;
  };

  const deptCountryCols = useMemo(() => buildPivotColumns(data.deptCountry), [data.deptCountry]);
  const jobCountryCols = useMemo(() => buildPivotColumns(data.jobCountry), [data.jobCountry]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '2rem' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-display)', marginBottom: 'var(--space-2)' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Salary analytics and reporting</p>
      </div>

      <Card>
        <h2 style={{ padding: 'var(--space-4)', paddingBottom: 0, fontSize: 'var(--text-h2)' }}>Salary Summary by Country</h2>
        <div style={{ padding: 'var(--space-4)' }}>
          <DataTable columns={summaryCols} data={data.summary} />
        </div>
      </Card>

      <Card>
        <h2 style={{ padding: 'var(--space-4)', paddingBottom: 0, fontSize: 'var(--text-h2)' }}>Average Salary by Department</h2>
        <div style={{ padding: 'var(--space-4)' }}>
          <DataTable columns={deptCols} data={data.dept} />
        </div>
      </Card>

      <Card>
        <h2 style={{ padding: 'var(--space-4)', paddingBottom: 0, fontSize: 'var(--text-h2)' }}>Average Salary by Job Title</h2>
        <div style={{ padding: 'var(--space-4)' }}>
          <DataTable columns={jobCols} data={data.jobTitle} />
        </div>
      </Card>

      <Card>
        <h2 style={{ padding: 'var(--space-4)', paddingBottom: 0, fontSize: 'var(--text-h2)' }}>Average Salary by Department & Country</h2>
        <div style={{ padding: 'var(--space-4)', overflowX: 'auto' }}>
          <DataTable columns={deptCountryCols} data={data.deptCountry} />
        </div>
      </Card>

      <Card>
        <h2 style={{ padding: 'var(--space-4)', paddingBottom: 0, fontSize: 'var(--text-h2)' }}>Average Salary by Job Title & Country</h2>
        <div style={{ padding: 'var(--space-4)', overflowX: 'auto' }}>
          <DataTable columns={jobCountryCols} data={data.jobCountry} />
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
