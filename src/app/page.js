import SchedulerPage from "../components/Scheduler";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6">
                <h1 className="text-2xl font-bold text-center mb-4">CPU Scheduling Simulator</h1>
                <SchedulerPage />
            </div>
        </main>
    );
}
