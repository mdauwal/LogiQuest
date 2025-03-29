
export const fetchContributors = async () => {
    try {
      const response = await fetch(
        "https://api.github.com/repos/MindFlowInteractive/LogiQuest/contributors"
      );
  
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching contributors:", error);
      throw error;
    }
  };