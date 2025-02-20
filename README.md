
# Code Agent

**Code Agent** is a Visual Studio Code extension that helps automate project setup and development workflows using AI-generated instructions. Based on user queries, Code Agent generates detailed implementation plans, executes dynamic setup commands, and even generates complete project source code—all from within VS Code.

## Features

- **AI-Generated Project Plans:**  
  Simply type in your project query, and Code Agent uses an LLM to generate a detailed plan with recommended technology stacks, key components, and step-by-step instructions.

- **Automated Setup Workflow:**  
  Code Agent can execute dynamic terminal commands to scaffold your project, create necessary folders, and launch your project.

- **Development Code Generation:**  
  For full development workflows, the extension can use the LLM to generate production-ready source code, writing files to your project folder.

- **Interactive Webview Interface:**  
  A built-in webview allows you to review the generated plan and select options (e.g., "Setup Project" or "Develop Project") to continue the workflow.

## Installation

### Prerequisites

- **Visual Studio Code** (latest version recommended)
- **Node.js** and **npm** (for building the extension)
- An active **OpenAI API key** (stored in a `.env` file and not committed to source control)

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/vishalp23/Code-Agent.git
   cd Code-Agent
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment:**

   Create a `.env` file at the root of the repository with the following content:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   **Note:** Make sure the `.env` file is added to `.gitignore` so that your secrets are not pushed to the remote repository.

4. **Build the Extension:**

   Compile the TypeScript code (if not using a watcher):

   ```bash
   npm run compile
   ```

5. **Run the Extension in VS Code:**

   Press `F5` in VS Code to launch a new Extension Development Host window with Code Agent activated.

## Usage

1. **Activate the Extension:**

   Once Code Agent is activated, open the webview panel titled **Code Agent** in VS Code.

2. **Generate a Plan:**

   - Type your project query (e.g., "Create a React app with a Python backend") in the input field.
   - Click the **Send** button (or press Enter).
   - Code Agent will generate and display a detailed plan using an LLM.

3. **Select an Option:**

   After reviewing the plan, choose an option (e.g., "Setup Project" or "Develop Project") from the displayed buttons.  
   The extension will then execute the corresponding workflow:
   - **Setup Project:** Runs terminal commands to scaffold the project.
   - **Develop Project:** Generates full source code and writes files to your project folder.

## Contributing

Contributions are welcome! If you have ideas for improvements, bug fixes, or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or support, please [open an issue](https://github.com/vishalp23/Code-Agent/issues).

