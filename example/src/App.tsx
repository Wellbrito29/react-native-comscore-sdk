import { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Comscore from 'react-native-comscore';

export default function App() {
  const [version, setVersion] = useState<string>('unknown');
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog((prev) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev,
    ]);
  };

  useEffect(() => {
    Comscore.getVersion()
      .then((v) => {
        setVersion(v);
        addLog(`Comscore SDK Version: ${v}`);
      })
      .catch((err) => addLog(`Error getting version: ${err.message}`));
  }, []);

  const handleInitialize = async () => {
    try {
      addLog('Initializing Comscore...');
      await Comscore.initialize({
        publisherId: 'YOUR_PUBLISHER_ID', // Replace with a real ID for testing
        applicationName: 'Example App',
        debugLogs: true,
      });
      addLog('Comscore Initialized');
    } catch (err: any) {
      addLog(`Initialization Error: ${err.message}`);
    }
  };

  const handleTrackSection = async () => {
    try {
      addLog('Tracking section "Home"...');
      await Comscore.trackSection('Home');
      addLog('Section tracked');
    } catch (err: any) {
      addLog(`Tracking Error: ${err.message}`);
    }
  };

  const handleNotifyUxActive = async () => {
    try {
      addLog('Notifying UX Active...');
      await Comscore.notifyUxActive();
      addLog('UX Active notified');
    } catch (err: any) {
      addLog(`UX Active Error: ${err.message}`);
    }
  };

  const handleNotifyUxInactive = async () => {
    try {
      addLog('Notifying UX Inactive...');
      await Comscore.notifyUxInactive();
      addLog('UX Inactive notified');
    } catch (err: any) {
      addLog(`UX Inactive Error: ${err.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comscore Example</Text>
        <Text style={styles.subtitle}>SDK Version: {version}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleInitialize}>
          <Text style={styles.buttonText}>Initialize</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleTrackSection}>
          <Text style={styles.buttonText}>Track Section</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleNotifyUxActive}>
          <Text style={styles.buttonText}>Notify UX Active</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNotifyUxInactive}
        >
          <Text style={styles.buttonText}>Notify UX Inactive</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Logs:</Text>
        <ScrollView style={styles.scrollView}>
          {log.map((item, index) => (
            <Text key={index} style={styles.logItem}>
              {item}
            </Text>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#6200EE',
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  buttonContainer: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#03DAC6',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    minWidth: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: '600',
  },
  logContainer: {
    flex: 1,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scrollView: {
    flex: 1,
  },
  logItem: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 2,
    color: '#333',
  },
});
