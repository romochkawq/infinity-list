import { MainPage } from '@pages/main-page';

import { AppProviders } from './providers/AppProviders';
import './styles/global.css';

export function App() {
	return (
		<AppProviders>
			<MainPage />
		</AppProviders>
	);
}
