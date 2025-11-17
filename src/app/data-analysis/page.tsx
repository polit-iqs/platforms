import { MetricCard } from "@/components/analytics/MetricCard";
import { CategoryChart } from "@/components/analytics/CategoryChart";
import { TopPerformers } from "@/components/analytics/TopPerformers";
import { ActivityFeed } from "@/components/analytics/ActivityFeed";
import {
  Users,
  DollarSign,
  FolderKanban,
  TrendingUp,
} from "lucide-react";
import analyticsData from "@/public/analytics_output.json";

export default function DataAnalysisPage() {
  const { overview, categoryDistribution, topPerformers, recentActivity } =
    analyticsData;

  return (
    <main className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Data Analysis Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and performance metrics
        </p>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={overview.totalUsers.toLocaleString()}
          icon={<Users className="h-4 w-4" />}
          trend="up"
          trendValue={overview.growthRate}
          description="from last month"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${overview.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
          trendValue={15.2}
          description="from last month"
        />
        <MetricCard
          title="Active Projects"
          value={overview.activeProjects}
          icon={<FolderKanban className="h-4 w-4" />}
          description="currently in progress"
        />
        <MetricCard
          title="Completion Rate"
          value={`${overview.completionRate}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
          trendValue={2.3}
          description="from last quarter"
        />
      </div>

      {/* Charts and Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <CategoryChart data={categoryDistribution} />
        <TopPerformers data={topPerformers} />
      </div>

      {/* Activity Feed */}
      <ActivityFeed data={recentActivity} />
    </main>
  );
}

