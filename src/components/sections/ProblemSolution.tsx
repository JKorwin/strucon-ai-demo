"use client";

export default function ProblemSolution() {
  return (
    <section className="container mx-auto py-20 px-4 grid md:grid-cols-2 gap-10">
      <div>
        <h2 className="font-bold text-3xl mb-5">Problems We Solve</h2>
        <ul className="list-disc list-inside text-lg">
          <li>Time-consuming data analysis and report generation.</li>
          <li>Poor visibility into project expenses and profitability.</li>
          <li>Difficulty tracking vendor performance and costs.</li>
        </ul>
      </div>
      <div>
        <h2 className="font-bold text-3xl mb-5">Our Solution</h2>
        <p className="text-lg">
          <strong>Strucon AI</strong> provides clear, real-time analytics through seamless integration with existing CRM platforms,
          empowering construction companies with actionable insights and enhanced decision-making.
        </p>
      </div>
    </section>
  );
}
