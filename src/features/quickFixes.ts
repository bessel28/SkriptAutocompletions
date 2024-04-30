import { CancellationToken, CodeAction, CodeActionContext, CodeActionKind, CodeActionProvider, Command, commands, ConfigurationTarget, ExtensionContext, languages, ProviderResult, Range, Selection, TextDocument, workspace, WorkspaceConfiguration } from 'vscode';

const DIAGNOSTIC_CODE = "NO_SKRIPT_FUNCTION";

export class addFunctionAction implements CodeActionProvider {

	provideCodeActions(document: TextDocument, range: Range | Selection, context: CodeActionContext, token: CancellationToken): ProviderResult<(CodeAction | Command)[]> {

		const relevantDiagnostics = context.diagnostics.filter( d => d.code == DIAGNOSTIC_CODE);

		if (relevantDiagnostics.length == 0) return [];

		const fixAction = new CodeAction('Add function to dictionary', CodeActionKind.QuickFix);
        fixAction.command = {
            command: 'SkriptAutocompletions.addFunction',
            title: 'Add function to dictionary',
			arguments: [document, range]
        };
        return [fixAction];
	}
	resolveCodeAction?(codeAction: CodeAction, token: CancellationToken): ProviderResult<CodeAction> {
		return codeAction;
	}
}	

export function addFunction(context: ExtensionContext, config: WorkspaceConfiguration){
	// Register the code action provider
	context.subscriptions.push(
		languages.registerCodeActionsProvider('skript', new addFunctionAction())
	);

	// Register the command handler for fixing the issue
	context.subscriptions.push(
		commands.registerCommand('SkriptAutocompletions.addFunction', (document: TextDocument, range: Range) => 
			addFunctionToConfig(document, range)
		)
	);
}

function addFunctionToConfig(document: TextDocument, range: Range) {
	const config: WorkspaceConfiguration = workspace.getConfiguration();
	var text = document.getText(range);
	var funcs = config.get<String[]>("SkriptAutocompletions.functions");
	if (funcs == null) funcs = []

	text = text.replace(/(.*?)\(.*\)/, "$1");

	// if function already added
	if (funcs.indexOf(text) > -1) return;

	funcs.push(text);
	config.update("SkriptAutocompletions.functions", funcs, ConfigurationTarget.Workspace);

	console.log("Added " + text + " to funcs")
	console.log(config.get<String[]>("SkriptAutocompletions.functions", []))
}