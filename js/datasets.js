/**
 * Sample datasets for the Cytoscape playground
 */

/**
 * Sample dataset: Workflow (No Groups, Medium Content)
 * Features: No groups, icon + title + description (no metrics)
 */
function getWorkflowData() {
    return [
        // Start node
        { group: 'nodes', data: {
            id: 'start',
            nodeType: 'terminal',
            title: 'Start',
            description: 'Initialize the customer onboarding workflow'
        }, classes: 'terminal' },

        // Input validation
        { group: 'nodes', data: {
            id: 'collect_info',
            nodeType: 'process',
            title: 'Collect Customer Information',
            description: 'Gather required details including name, email, phone, and address from the registration form'
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'validate_email',
            nodeType: 'process',
            title: 'Validate Email',
            description: 'Check email format and verify domain exists'
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'check_duplicates',
            nodeType: 'decision',
            title: 'Check for Duplicate Account',
            description: 'Search existing records to prevent duplicate registrations'
        }, classes: 'decision' },

        // Duplicate handling
        { group: 'nodes', data: {
            id: 'reject_duplicate',
            nodeType: 'terminal',
            title: 'Reject - Duplicate Found',
            description: 'Notify user that account already exists and provide recovery options'
        }, classes: 'terminal' },

        // Account creation path
        { group: 'nodes', data: {
            id: 'create_account',
            nodeType: 'process',
            title: 'Create Account',
            description: 'Generate new user account with encrypted password and unique identifier'
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'send_verification',
            nodeType: 'process',
            title: 'Send Verification Email',
            description: 'Email confirmation link to verify account ownership'
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'wait_verification',
            nodeType: 'decision',
            title: 'Wait for Email Verification',
            description: 'Monitor for user clicking verification link within 24 hours'
        }, classes: 'decision' },

        // Verification timeout
        { group: 'nodes', data: {
            id: 'timeout',
            nodeType: 'terminal',
            title: 'Verification Timeout',
            description: 'Account suspended due to unverified email after 24 hours'
        }, classes: 'terminal' },

        // Setup profile
        { group: 'nodes', data: {
            id: 'setup_profile',
            nodeType: 'process',
            title: 'Setup User Profile',
            description: 'Configure preferences, avatar, and notification settings'
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'assign_permissions',
            nodeType: 'process',
            title: 'Assign Default Permissions',
            description: 'Grant basic access rights and role-based permissions'
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'send_welcome',
            nodeType: 'process',
            title: 'Send Welcome Email',
            description: 'Deliver welcome message with getting started guide and support resources'
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'complete',
            nodeType: 'terminal',
            title: 'Onboarding Complete',
            description: 'User successfully onboarded and ready to use the platform'
        }, classes: 'terminal' },

        // Edges
        { group: 'edges', data: { source: 'start', target: 'collect_info' } },
        { group: 'edges', data: { source: 'collect_info', target: 'validate_email' } },
        { group: 'edges', data: { source: 'validate_email', target: 'check_duplicates' } },
        { group: 'edges', data: { source: 'check_duplicates', target: 'reject_duplicate' } },
        { group: 'edges', data: { source: 'check_duplicates', target: 'create_account' } },
        { group: 'edges', data: { source: 'create_account', target: 'send_verification' } },
        { group: 'edges', data: { source: 'send_verification', target: 'wait_verification' } },
        { group: 'edges', data: { source: 'wait_verification', target: 'timeout' } },
        { group: 'edges', data: { source: 'wait_verification', target: 'setup_profile' } },
        { group: 'edges', data: { source: 'setup_profile', target: 'assign_permissions' } },
        { group: 'edges', data: { source: 'assign_permissions', target: 'send_welcome' } },
        { group: 'edges', data: { source: 'send_welcome', target: 'complete' } }
    ];
}

/**
 * Sample dataset: Org Chart (No Groups, Minimal)
 * Features: No groups, minimal content (icon + title only)
 */
function getOrganizationData() {
    return [
        // Executive Level
        { group: 'nodes', data: {
            id: 'ceo',
            nodeType: 'user',
            title: 'CEO'
        }, classes: 'user' },

        // C-Suite
        { group: 'nodes', data: {
            id: 'cto',
            nodeType: 'user',
            title: 'CTO'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'cfo',
            nodeType: 'user',
            title: 'CFO'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'coo',
            nodeType: 'user',
            title: 'COO'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'cmo',
            nodeType: 'user',
            title: 'CMO'
        }, classes: 'user' },

        // Engineering
        { group: 'nodes', data: {
            id: 'vp_eng',
            nodeType: 'user',
            title: 'VP Engineering'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'dir_backend',
            nodeType: 'user',
            title: 'Director Backend'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'dir_frontend',
            nodeType: 'user',
            title: 'Director Frontend'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'dir_mobile',
            nodeType: 'user',
            title: 'Director Mobile'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'lead_backend',
            nodeType: 'user',
            title: 'Backend Lead'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'lead_frontend',
            nodeType: 'user',
            title: 'Frontend Lead'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'lead_mobile',
            nodeType: 'user',
            title: 'Mobile Lead'
        }, classes: 'user' },

        // Product
        { group: 'nodes', data: {
            id: 'vp_product',
            nodeType: 'user',
            title: 'VP Product'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'pm_platform',
            nodeType: 'user',
            title: 'PM Platform'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'pm_growth',
            nodeType: 'user',
            title: 'PM Growth'
        }, classes: 'user' },

        // Design
        { group: 'nodes', data: {
            id: 'dir_design',
            nodeType: 'user',
            title: 'Director Design'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'lead_ux',
            nodeType: 'user',
            title: 'UX Lead'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'lead_ui',
            nodeType: 'user',
            title: 'UI Lead'
        }, classes: 'user' },

        // Operations
        { group: 'nodes', data: {
            id: 'vp_ops',
            nodeType: 'user',
            title: 'VP Operations'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'dir_devops',
            nodeType: 'user',
            title: 'Director DevOps'
        }, classes: 'user' },

        { group: 'nodes', data: {
            id: 'dir_security',
            nodeType: 'user',
            title: 'Director Security'
        }, classes: 'user' },

        // Edges - Reporting Structure
        { group: 'edges', data: { source: 'ceo', target: 'cto' } },
        { group: 'edges', data: { source: 'ceo', target: 'cfo' } },
        { group: 'edges', data: { source: 'ceo', target: 'coo' } },
        { group: 'edges', data: { source: 'ceo', target: 'cmo' } },

        { group: 'edges', data: { source: 'cto', target: 'vp_eng' } },
        { group: 'edges', data: { source: 'cto', target: 'vp_product' } },
        { group: 'edges', data: { source: 'cto', target: 'dir_design' } },

        { group: 'edges', data: { source: 'vp_eng', target: 'dir_backend' } },
        { group: 'edges', data: { source: 'vp_eng', target: 'dir_frontend' } },
        { group: 'edges', data: { source: 'vp_eng', target: 'dir_mobile' } },

        { group: 'edges', data: { source: 'dir_backend', target: 'lead_backend' } },
        { group: 'edges', data: { source: 'dir_frontend', target: 'lead_frontend' } },
        { group: 'edges', data: { source: 'dir_mobile', target: 'lead_mobile' } },

        { group: 'edges', data: { source: 'vp_product', target: 'pm_platform' } },
        { group: 'edges', data: { source: 'vp_product', target: 'pm_growth' } },

        { group: 'edges', data: { source: 'dir_design', target: 'lead_ux' } },
        { group: 'edges', data: { source: 'dir_design', target: 'lead_ui' } },

        { group: 'edges', data: { source: 'coo', target: 'vp_ops' } },
        { group: 'edges', data: { source: 'vp_ops', target: 'dir_devops' } },
        { group: 'edges', data: { source: 'vp_ops', target: 'dir_security' } }
    ];
}

/**
 * Sample dataset: System Architecture (With Groups, Minimal)
 * Features: Groups, icon + title only (no description or metrics)
 */
function getSystemArchitectureData() {
    return [
        // Client Layer
        { group: 'nodes', data: { id: 'client_layer', label: 'Client Applications' } },

        { group: 'nodes', data: {
            id: 'web_app',
            parent: 'client_layer',
            nodeType: 'system',
            title: 'Web App'
        }, classes: 'system' },

        { group: 'nodes', data: {
            id: 'mobile_ios',
            parent: 'client_layer',
            nodeType: 'system',
            title: 'iOS App'
        }, classes: 'system' },

        { group: 'nodes', data: {
            id: 'mobile_android',
            parent: 'client_layer',
            nodeType: 'system',
            title: 'Android App'
        }, classes: 'system' },

        { group: 'nodes', data: {
            id: 'desktop',
            parent: 'client_layer',
            nodeType: 'system',
            title: 'Desktop Client'
        }, classes: 'system' },

        // API Gateway Layer
        { group: 'nodes', data: { id: 'gateway_layer', label: 'API Gateway' } },

        { group: 'nodes', data: {
            id: 'load_balancer',
            parent: 'gateway_layer',
            nodeType: 'api',
            title: 'Load Balancer'
        }, classes: 'api' },

        { group: 'nodes', data: {
            id: 'api_gateway',
            parent: 'gateway_layer',
            nodeType: 'api',
            title: 'API Gateway'
        }, classes: 'api' },

        { group: 'nodes', data: {
            id: 'auth_service',
            parent: 'gateway_layer',
            nodeType: 'api',
            title: 'Auth Service'
        }, classes: 'api' },

        { group: 'nodes', data: {
            id: 'rate_limiter',
            parent: 'gateway_layer',
            nodeType: 'api',
            title: 'Rate Limiter'
        }, classes: 'api' },

        // Business Logic Layer
        { group: 'nodes', data: { id: 'service_layer', label: 'Microservices' } },

        { group: 'nodes', data: {
            id: 'user_service',
            parent: 'service_layer',
            nodeType: 'system',
            title: 'User Service'
        }, classes: 'system' },

        { group: 'nodes', data: {
            id: 'product_service',
            parent: 'service_layer',
            nodeType: 'system',
            title: 'Product Service'
        }, classes: 'system' },

        { group: 'nodes', data: {
            id: 'order_service',
            parent: 'service_layer',
            nodeType: 'system',
            title: 'Order Service'
        }, classes: 'system' },

        { group: 'nodes', data: {
            id: 'payment_service',
            parent: 'service_layer',
            nodeType: 'system',
            title: 'Payment Service'
        }, classes: 'system' },

        { group: 'nodes', data: {
            id: 'notification_service',
            parent: 'service_layer',
            nodeType: 'system',
            title: 'Notification Service'
        }, classes: 'system' },

        { group: 'nodes', data: {
            id: 'search_service',
            parent: 'service_layer',
            nodeType: 'system',
            title: 'Search Service'
        }, classes: 'system' },

        // Data Layer
        { group: 'nodes', data: { id: 'data_layer', label: 'Data & Cache' } },

        { group: 'nodes', data: {
            id: 'postgres',
            parent: 'data_layer',
            nodeType: 'data',
            title: 'PostgreSQL'
        }, classes: 'data' },

        { group: 'nodes', data: {
            id: 'mongodb',
            parent: 'data_layer',
            nodeType: 'data',
            title: 'MongoDB'
        }, classes: 'data' },

        { group: 'nodes', data: {
            id: 'redis',
            parent: 'data_layer',
            nodeType: 'data',
            title: 'Redis'
        }, classes: 'data' },

        { group: 'nodes', data: {
            id: 'elasticsearch',
            parent: 'data_layer',
            nodeType: 'data',
            title: 'Elasticsearch'
        }, classes: 'data' },

        { group: 'nodes', data: {
            id: 's3',
            parent: 'data_layer',
            nodeType: 'data',
            title: 'S3 Storage'
        }, classes: 'data' },

        // Message Queue Layer
        { group: 'nodes', data: { id: 'queue_layer', label: 'Message Queue' } },

        { group: 'nodes', data: {
            id: 'kafka',
            parent: 'queue_layer',
            nodeType: 'api',
            title: 'Kafka'
        }, classes: 'api' },

        { group: 'nodes', data: {
            id: 'rabbitmq',
            parent: 'queue_layer',
            nodeType: 'api',
            title: 'RabbitMQ'
        }, classes: 'api' },

        // Edges - Client to Gateway
        { group: 'edges', data: { source: 'web_app', target: 'load_balancer' } },
        { group: 'edges', data: { source: 'mobile_ios', target: 'load_balancer' } },
        { group: 'edges', data: { source: 'mobile_android', target: 'load_balancer' } },
        { group: 'edges', data: { source: 'desktop', target: 'load_balancer' } },

        // Gateway Layer
        { group: 'edges', data: { source: 'load_balancer', target: 'api_gateway' } },
        { group: 'edges', data: { source: 'api_gateway', target: 'auth_service' } },
        { group: 'edges', data: { source: 'api_gateway', target: 'rate_limiter' } },

        // Gateway to Services
        { group: 'edges', data: { source: 'api_gateway', target: 'user_service' } },
        { group: 'edges', data: { source: 'api_gateway', target: 'product_service' } },
        { group: 'edges', data: { source: 'api_gateway', target: 'order_service' } },
        { group: 'edges', data: { source: 'api_gateway', target: 'search_service' } },

        // Services to Data
        { group: 'edges', data: { source: 'user_service', target: 'postgres' } },
        { group: 'edges', data: { source: 'user_service', target: 'redis' } },
        { group: 'edges', data: { source: 'product_service', target: 'mongodb' } },
        { group: 'edges', data: { source: 'product_service', target: 'redis' } },
        { group: 'edges', data: { source: 'order_service', target: 'postgres' } },
        { group: 'edges', data: { source: 'payment_service', target: 'postgres' } },
        { group: 'edges', data: { source: 'search_service', target: 'elasticsearch' } },

        // Services to Storage
        { group: 'edges', data: { source: 'product_service', target: 's3' } },
        { group: 'edges', data: { source: 'notification_service', target: 's3' } },

        // Services to Message Queue
        { group: 'edges', data: { source: 'order_service', target: 'kafka' } },
        { group: 'edges', data: { source: 'payment_service', target: 'kafka' } },
        { group: 'edges', data: { source: 'notification_service', target: 'rabbitmq' } },

        // Inter-service Communication
        { group: 'edges', data: { source: 'order_service', target: 'payment_service' } },
        { group: 'edges', data: { source: 'order_service', target: 'notification_service' } },
        { group: 'edges', data: { source: 'payment_service', target: 'notification_service' } }
    ];
}

/**
 * Sample dataset: Complex (With Groups, Full Features)
 * Features: Groups, icons, titles, descriptions, metrics, edge labels, varied text lengths
 */
function getComplexDiagramData() {
    return [
        // Group 1: Data Ingestion Layer
        { group: 'nodes', data: { id: 'group_ingestion', label: 'Data Ingestion' } },

        { group: 'nodes', data: {
            id: 'kafka_stream',
            parent: 'group_ingestion',
            nodeType: 'api',
            title: 'Apache Kafka Event Stream Processing and Message Queue System',
            description: 'High-throughput distributed streaming platform that handles real-time data feeds from multiple sources. Processes millions of events per second with fault-tolerant architecture and horizontal scalability.',
            metrics: { 'Throughput': '2M/s', 'Lag': '50ms', 'Partitions': '128' }
        }, classes: 'api' },

        { group: 'nodes', data: {
            id: 'rest_api',
            parent: 'group_ingestion',
            nodeType: 'api',
            title: 'RESTful API Gateway',
            description: 'Handles HTTP requests and provides unified interface for external clients.',
            metrics: { 'RPS': '15k', 'Latency': '45ms', 'Uptime': '99.9%' }
        }, classes: 'api' },

        { group: 'nodes', data: {
            id: 'file_watcher',
            parent: 'group_ingestion',
            nodeType: 'system',
            title: 'File System Monitor and Batch Import Service',
            description: 'Monitors designated directories for new data files and triggers automated batch processing workflows.',
            metrics: { 'Files/hr': '500', 'Size': '2TB', 'Format': 'CSV' }
        }, classes: 'system' },

        // Group 2: Processing & Transformation
        { group: 'nodes', data: { id: 'group_processing', label: 'Processing' } },

        { group: 'nodes', data: {
            id: 'etl_pipeline',
            parent: 'group_processing',
            nodeType: 'process',
            title: 'ETL Pipeline with Data Quality Validation and Cleansing',
            description: 'Extract, transform, and load operations with comprehensive data quality checks. Handles schema validation, duplicate detection, and data enrichment from multiple reference sources.',
            metrics: { 'Records': '5M/hr', 'Quality': '98%', 'Errors': '0.2%' }
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'ml_inference',
            parent: 'group_processing',
            nodeType: 'process',
            title: 'Machine Learning Inference Engine',
            description: 'Real-time ML model serving with GPU acceleration for predictions and classifications.',
            metrics: { 'Models': '12', 'GPU': '85%', 'Accuracy': '94%' }
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'aggregator',
            parent: 'group_processing',
            nodeType: 'process',
            title: 'Real-time Aggregation and Statistical Analysis Service',
            description: 'Computes rolling windows, aggregates, and statistical metrics across time-series data streams.',
            metrics: { 'Windows': '5m', 'Metrics': '200', 'Memory': '16GB' }
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'decision_engine',
            parent: 'group_processing',
            nodeType: 'decision',
            title: 'Business Rules Decision Engine',
            description: 'Evaluates complex business rules and routing logic to determine data flow paths.',
            metrics: { 'Rules': '150', 'Eval/s': '10k' }
        }, classes: 'decision' },

        // Group 3: Storage & Persistence
        { group: 'nodes', data: { id: 'group_storage', label: 'Storage' } },

        { group: 'nodes', data: {
            id: 'timeseries_db',
            parent: 'group_storage',
            nodeType: 'data',
            title: 'Time-Series Database (InfluxDB)',
            description: 'Optimized for high-write throughput time-series data with automatic downsampling and retention policies.',
            metrics: { 'Points': '100B', 'Write': '1M/s', 'Retention': '90d' }
        }, classes: 'data' },

        { group: 'nodes', data: {
            id: 'document_store',
            parent: 'group_storage',
            nodeType: 'data',
            title: 'Document Store (MongoDB)',
            description: 'Flexible schema NoSQL database for semi-structured data and metadata storage.',
            metrics: { 'Docs': '50M', 'Size': '2TB', 'Shards': '8' }
        }, classes: 'data' },

        { group: 'nodes', data: {
            id: 'data_lake',
            parent: 'group_storage',
            nodeType: 'data',
            title: 'Data Lake (S3) for Long-term Archival and Historical Analysis',
            description: 'Scalable object storage for raw data archival, supporting both structured and unstructured data formats with lifecycle management.',
            metrics: { 'Objects': '10M', 'Size': '500TB', 'Cost': '$2k/mo' }
        }, classes: 'data' },

        { group: 'nodes', data: {
            id: 'cache_layer',
            parent: 'group_storage',
            nodeType: 'data',
            title: 'Distributed Cache (Redis Cluster)',
            description: 'In-memory cache for frequently accessed data with sub-millisecond latency.',
            metrics: { 'Hit Rate': '96%', 'Keys': '5M', 'Memory': '64GB' }
        }, classes: 'data' },

        // Group 4: Analytics & Reporting
        { group: 'nodes', data: { id: 'group_analytics', label: 'Analytics' } },

        { group: 'nodes', data: {
            id: 'dashboard',
            parent: 'group_analytics',
            nodeType: 'system',
            title: 'Real-time Analytics Dashboard',
            description: 'Interactive visualization platform with customizable widgets and drill-down capabilities.',
            metrics: { 'Users': '500', 'Widgets': '50', 'Refresh': '5s' }
        }, classes: 'system' },

        { group: 'nodes', data: {
            id: 'report_gen',
            parent: 'group_analytics',
            nodeType: 'process',
            title: 'Automated Report Generation and Distribution System',
            description: 'Scheduled report generation with multiple output formats and automated email distribution to stakeholders.',
            metrics: { 'Reports': '200/d', 'Formats': '3', 'Recipients': '150' }
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'alerting',
            parent: 'group_analytics',
            nodeType: 'system',
            title: 'Intelligent Alerting and Notification Service',
            description: 'Monitors metrics and triggers alerts based on thresholds with smart deduplication and escalation policies.',
            metrics: { 'Alerts': '50/d', 'Channels': '5', 'MTTR': '15m' }
        }, classes: 'system' },

        // Edges with descriptive labels
        { group: 'edges', data: { source: 'kafka_stream', target: 'etl_pipeline', label: 'Stream Events' } },
        { group: 'edges', data: { source: 'rest_api', target: 'etl_pipeline', label: 'API Requests' } },
        { group: 'edges', data: { source: 'file_watcher', target: 'etl_pipeline', label: 'Batch Files' } },
        { group: 'edges', data: { source: 'etl_pipeline', target: 'decision_engine', label: 'Validated Data' } },
        { group: 'edges', data: { source: 'etl_pipeline', target: 'ml_inference', label: 'Feature Vectors' } },
        { group: 'edges', data: { source: 'decision_engine', target: 'aggregator', label: 'Route A: Aggregate' } },
        { group: 'edges', data: { source: 'decision_engine', target: 'timeseries_db', label: 'Route B: Direct Store' } },
        { group: 'edges', data: { source: 'ml_inference', target: 'document_store', label: 'Predictions' } },
        { group: 'edges', data: { source: 'aggregator', target: 'timeseries_db', label: 'Metrics' } },
        { group: 'edges', data: { source: 'aggregator', target: 'cache_layer', label: 'Hot Data' } },
        { group: 'edges', data: { source: 'timeseries_db', target: 'data_lake', label: 'Archive' } },
        { group: 'edges', data: { source: 'document_store', target: 'data_lake', label: 'Backup' } },
        { group: 'edges', data: { source: 'cache_layer', target: 'dashboard', label: 'Real-time Feed' } },
        { group: 'edges', data: { source: 'timeseries_db', target: 'dashboard', label: 'Historical Data' } },
        { group: 'edges', data: { source: 'document_store', target: 'report_gen', label: 'Query Results' } },
        { group: 'edges', data: { source: 'timeseries_db', target: 'alerting', label: 'Metrics Stream' } },
        { group: 'edges', data: { source: 'dashboard', target: 'alerting', label: 'User Alerts' } }
    ];
}



/**
 * Sample dataset: Complex (No Groups, Full Features)
 * Features: No groups, icons, titles, descriptions, metrics, edge labels, varied text lengths
 * Same rich content as Complex Diagram but without compound nodes
 */
function getComplexNoGroupsData() {
    return [
        // Data Ingestion Layer (no group container)
        { group: 'nodes', data: {
            id: 'kafka_stream',
            nodeType: 'api',
            title: 'Apache Kafka Event Stream',
            description: 'High-throughput distributed streaming platform for real-time data feeds.',
            metrics: { 'Throughput': '2M/s', 'Lag': '50ms' }
        }, classes: 'api' },

        { group: 'nodes', data: {
            id: 'rest_api',
            nodeType: 'api',
            title: 'RESTful API Gateway',
            description: 'Handles HTTP requests and provides unified interface.',
            metrics: { 'RPS': '15k', 'Latency': '45ms' }
        }, classes: 'api' },

        { group: 'nodes', data: {
            id: 'file_watcher',
            nodeType: 'system',
            title: 'File System Monitor',
            description: 'Monitors directories for new data files and triggers batch processing.',
            metrics: { 'Files/hr': '500', 'Size': '2TB' }
        }, classes: 'system' },

        // Processing & Transformation (no group container)
        { group: 'nodes', data: {
            id: 'etl_pipeline',
            nodeType: 'process',
            title: 'ETL Pipeline with Data Quality Validation',
            description: 'Extract, transform, and load operations with comprehensive data quality checks and schema validation.',
            metrics: { 'Records': '5M/hr', 'Quality': '98%' }
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'ml_inference',
            nodeType: 'process',
            title: 'Machine Learning Inference Engine',
            description: 'Real-time ML model serving with GPU acceleration for predictions.',
            metrics: { 'Models': '12', 'GPU': '85%' }
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'aggregator',
            nodeType: 'process',
            title: 'Real-time Aggregation Service',
            description: 'Computes rolling windows and statistical metrics across time-series data.',
            metrics: { 'Windows': '5m', 'Metrics': '200' }
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'decision_engine',
            nodeType: 'decision',
            title: 'Business Rules Engine',
            description: 'Evaluates complex business rules and routing logic.',
            metrics: { 'Rules': '150', 'Eval/s': '10k' }
        }, classes: 'decision' },

        // Storage & Persistence (no group container)
        { group: 'nodes', data: {
            id: 'timeseries_db',
            nodeType: 'data',
            title: 'Time-Series Database',
            description: 'Optimized for high-write throughput time-series data with automatic downsampling.',
            metrics: { 'Points': '100B', 'Write': '1M/s' }
        }, classes: 'data' },

        { group: 'nodes', data: {
            id: 'document_store',
            nodeType: 'data',
            title: 'Document Store (MongoDB)',
            description: 'Flexible schema NoSQL database for semi-structured data and metadata.',
            metrics: { 'Docs': '50M', 'Size': '2TB' }
        }, classes: 'data' },

        { group: 'nodes', data: {
            id: 'data_lake',
            nodeType: 'data',
            title: 'Data Lake for Long-term Archival',
            description: 'Scalable object storage for raw data archival supporting structured and unstructured formats.',
            metrics: { 'Objects': '10M', 'Size': '500TB' }
        }, classes: 'data' },

        { group: 'nodes', data: {
            id: 'cache_layer',
            nodeType: 'data',
            title: 'Distributed Cache (Redis)',
            description: 'In-memory cache for frequently accessed data with sub-millisecond latency.',
            metrics: { 'Hit Rate': '96%', 'Keys': '5M' }
        }, classes: 'data' },

        // Analytics & Reporting (no group container)
        { group: 'nodes', data: {
            id: 'dashboard',
            nodeType: 'system',
            title: 'Real-time Analytics Dashboard',
            description: 'Interactive visualization platform with customizable widgets and drill-down capabilities.',
            metrics: { 'Users': '500', 'Widgets': '50' }
        }, classes: 'system' },

        { group: 'nodes', data: {
            id: 'report_gen',
            nodeType: 'process',
            title: 'Automated Report Generation System',
            description: 'Scheduled report generation with multiple output formats and automated email distribution.',
            metrics: { 'Reports': '200/d', 'Formats': '3' }
        }, classes: 'process' },

        { group: 'nodes', data: {
            id: 'alerting',
            nodeType: 'system',
            title: 'Intelligent Alerting Service',
            description: 'Monitors metrics and triggers alerts based on thresholds with smart deduplication.',
            metrics: { 'Alerts': '50/d', 'MTTR': '15m' }
        }, classes: 'system' },

        // Edges with descriptive labels
        { group: 'edges', data: { source: 'kafka_stream', target: 'etl_pipeline', label: 'Stream Events' } },
        { group: 'edges', data: { source: 'rest_api', target: 'etl_pipeline', label: 'API Requests' } },
        { group: 'edges', data: { source: 'file_watcher', target: 'etl_pipeline', label: 'Batch Files' } },
        { group: 'edges', data: { source: 'etl_pipeline', target: 'decision_engine', label: 'Validated Data' } },
        { group: 'edges', data: { source: 'etl_pipeline', target: 'ml_inference', label: 'Feature Vectors' } },
        { group: 'edges', data: { source: 'decision_engine', target: 'aggregator', label: 'Route A' } },
        { group: 'edges', data: { source: 'decision_engine', target: 'timeseries_db', label: 'Route B' } },
        { group: 'edges', data: { source: 'ml_inference', target: 'document_store', label: 'Predictions' } },
        { group: 'edges', data: { source: 'aggregator', target: 'timeseries_db', label: 'Metrics' } },
        { group: 'edges', data: { source: 'aggregator', target: 'cache_layer', label: 'Hot Data' } },
        { group: 'edges', data: { source: 'timeseries_db', target: 'data_lake', label: 'Archive' } },
        { group: 'edges', data: { source: 'document_store', target: 'data_lake', label: 'Backup' } },
        { group: 'edges', data: { source: 'cache_layer', target: 'dashboard', label: 'Real-time Feed' } },
        { group: 'edges', data: { source: 'timeseries_db', target: 'dashboard', label: 'Historical Data' } },
        { group: 'edges', data: { source: 'document_store', target: 'report_gen', label: 'Query Results' } },
        { group: 'edges', data: { source: 'timeseries_db', target: 'alerting', label: 'Metrics Stream' } },
        { group: 'edges', data: { source: 'dashboard', target: 'alerting', label: 'User Alerts' } }
    ];
}
