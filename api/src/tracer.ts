import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  metrics,
} from '@opentelemetry/api';

const SERVICE_NAME = 'api-service';

const traceExporter = new OTLPTraceExporter();
const metricsExporter = new OTLPMetricExporter();
const metricReader = new PeriodicExportingMetricReader({
  exporter: metricsExporter,
  exportIntervalMillis: 10_000,
});

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: SERVICE_NAME,
  [ATTR_SERVICE_VERSION]: '1.0.0',
});

const mergedResource = resource;
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new NodeSDK({
  traceExporter,
  metricReaders: [metricReader],
  instrumentations: [getNodeAutoInstrumentations()],
  resource: mergedResource,
  serviceName: SERVICE_NAME,
});

sdk.start();

export { sdk, metrics };
