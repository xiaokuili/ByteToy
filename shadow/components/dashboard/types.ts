export type DashboardConfig = {
  // LLM specific configuration
  llmConfig?: {
    // The prompt template to be used for LLM generation
    prompt: string;
  };
};
