import { ViewSwitcher } from "@/components/example/view-switcher";

export default function ExamplePage() {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>View Switching Example</h1>
      <ViewSwitcher />
    </div>
  );
}
